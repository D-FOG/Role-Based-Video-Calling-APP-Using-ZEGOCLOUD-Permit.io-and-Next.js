import { Server as NetServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NetSocket & {
    server: NetServer & {
      io?: SocketServer
    }
  }
}

/* eslint-disable no-var */
declare global {
  var io: SocketServer | undefined
  var userMap: Map<string, { email: string; name: string }> | undefined
}
/* eslint-enable no-var */

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('New Socket.IO server initializing...')

    const userMap = new Map()
    const io = new SocketServer(res.socket.server, {
      path: '/api/sockets/socket.io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`)

      socket.on('join-room', ({ roomId, userId, email, name }) => {
        console.log(`User ${name} joined room: ${roomId}`)
        socket.join(roomId)
        socket.data.userId = userId;
        userMap.set(userId, { email, name })

        socket.emit('room-joined', { roomId, success: true })

        socket.on('get-user-meta', (userId, callback) => {
          const data = userMap.get(userId) || {}
          callback(data)
        })
      })
      
      socket.on('kick-user', ({ roomId, userId }) => {
        console.log(`Kicking user ${userId} from room ${roomId}`)

        // Get all connected sockets in that room
        //const sockets = io.sockets.sockets

        // Find the socket for the userId
        for (const s of io.sockets.sockets.values()) {
          if (s.data.userId === userId) {
            s.emit('kicked') // send kicked event to that user
            s.leave(roomId)
            s.disconnect(true)
            break
          }
        }

        // Optional: remove user from userMap
        userMap.delete(userId)
      })
    })

    res.socket.server.io = io
    global.io = io
    global.userMap = userMap
  }

  res.end()
}
