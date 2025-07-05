// app/api/permit-check.ts
import { NextRequest, NextResponse } from 'next/server'
import { permit } from '@/lib/permit'

type PermitPermission = {
  permissions: string[]
}

// Block GET requests
export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}

// Handle POST
export async function POST(req: NextRequest) {
  const { user, action, resourceId } = await req.json()
  const { id, email } = user || {}

  const [type, idPart] = resourceId.includes(':')
    ? resourceId.split(':')
    : ['zego-one', resourceId]

  const resourceKey = `${type}:${idPart}`           // e.g. zego-one:roomId
  const instancePermKey = `${type}:${action}`       // e.g. zego-one:speak

  console.log('Permit check request:', { id, email, action, resourceKey })

  let perms: Record<string, PermitPermission> | null = null

  try {
    //Try by email
    if (email && action !== 'host') {
      try {
        perms = await permit.getUserPermissions('flash@gmail.com')
        const inst = perms?.[resourceKey]
        if (inst?.permissions.includes(instancePermKey)) {
          console.log('Permission granted via email')
          return NextResponse.json({ allowed: true })
        }
      } catch (e) {
        console.warn(`Permit email check failed (${email}):`, (e as Error).message)
        // Continue to try by ID
      }
    }

    //Try by user ID
    if (id) {
      try {
        perms = await permit.getUserPermissions(id)
        const inst = perms?.[resourceKey]
        if (inst?.permissions.includes(instancePermKey)) {
          console.log('Permission granted via user ID')
          return NextResponse.json({ allowed: true })
        }
      } catch (e) {
        console.warn(`Permit ID check failed (${id}):`, (e as Error).message)
        // Still fallback to global check if action is `listen`
      }
    }

    //Fallback: check global `viewer` access for `listen` role
    if (action === 'listen' && perms) {
      const globalKey = '__tenant:default'
      const globalPerms = perms?.[globalKey]
      if (globalPerms?.permissions.includes(instancePermKey)) {
        console.log('Permission granted via global listener role')
        return NextResponse.json({ allowed: true })
      }
    }

    console.log('Permission denied')
    return NextResponse.json({ allowed: false })
  } catch (err: unknown) {
    console.error('Permit lookup fatal error:', err)
    const message = err instanceof Error ? err.message : 'Unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
