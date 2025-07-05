// pages/api/role-update.ts
import { permit } from '@/lib/permit'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as SocketIOServer } from 'socket.io'

interface ExtendedSocketServer extends SocketIOServer {
  userMap?: Map<string, { email: string; name: string }>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { userId, roomId, newRole } = req.body as {
      userId: string
      roomId: string
      newRole: 'speaker' | 'listener'
    }

    const io = (global as unknown as {io?: ExtendedSocketServer}).io
    const userMap = (global as unknown as {userMap?: Map<string, {email:string; name:string }> }).userMap

    if (!io || !userMap) {
      console.warn('Socket.IO or userMap not initialized')
      return res.status(500).json({ error: 'Socket.IO or userMap not initialized' })
    }

    const userMeta = userMap.get(userId)
    console.log('🔍 User meta for role update:', userMeta)
    if (!userMeta?.email) {
      console.warn('Email not found for user:', userId)
      return res.status(404).json({ error: 'Email not found for user' })
    }

    const email = userMeta.email
    const instance = `zego-one:${roomId}`

    // Remove all other roles for the instance before assigning new one
    const toRemove = ['speaker', 'listener'].filter((role) => role !== newRole)
    for (const role of toRemove) {
      try {
        await permit.api.roleAssignments.unassign({
          user: email,
          tenant: 'default',
          role,
          resource_instance: `zego-one:${roomId}`
        })
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { status?: number } }).response?.status === 'number' &&
          (err as { response: { status: number } }).response.status === 404
        ) {
          console.warn(`Skipping unassign: ${role} — not assigned or user not found`);
          continue;
        }
        throw err;
      }
    }

    await permit.api.roleAssignments.assign({
      user: email,
      tenant: 'default',
      role: newRole,
      resource_instance: instance,
    })

    // Notify all users in the room
    io.to(roomId).emit('role-changed', { userId, newRole })

    return res.status(200).json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred'
    if (err instanceof Error) {
      console.error('Role update failed:', err.message)
      return res.status(500).json({ error: err.message })
    }
    console.error('Role update failed:', err)
    return res.status(500).json({ error: message || 'Unknown error' })
  }
}
