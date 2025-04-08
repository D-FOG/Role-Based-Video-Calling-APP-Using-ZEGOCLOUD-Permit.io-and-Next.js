// 'use client'

// import React, { useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'
// import { ZegoExpressEngine } from 'zego-express-engine-webrtc'

// const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // add to .env
// const server = 'wss://webliveroom[region].zego.im/ws' // adjust for your region

// export default function CallRoom() {
//   const localVideoRef = useRef<HTMLVideoElement>(null)
//   const remoteVideoRef = useRef<HTMLVideoElement>(null)
//   const router = useRouter()
//   const { roomId } = router.query

//   useEffect(() => {
//     if (!roomId) return
//     const userID = `user_${Math.floor(Math.random() * 10000)}`
//     const userName = `Guest`

//     fetch('/api/auth/meeting-token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userID }),
//     })
//       .then(res => res.json())
//       .then(async ({ token }) => {
//         const zg = new ZegoExpressEngine(appID, server)

//         await zg.loginRoom(String(roomId), token, {
//           userID,
//           userName,
//         }, { userUpdate: true })

//         zg.createStream({ camera: { video: true, audio: true } }).then(localStream => {
//           localVideoRef.current!.srcObject = localStream
//           zg.startPublishingStream('localStream', localStream)
//         })

//         zg.on('roomStreamUpdate', (roomID, updateType, streamList) => {
//           if (updateType === 'ADD') {
//             const remoteStreamID = streamList[0].streamID
//             zg.startPlayingStream(remoteStreamID).then(remoteStream => {
//               remoteVideoRef.current!.srcObject = remoteStream
//             })
//           }
//         })
//       })
//   }, [roomId])

//   return (
//     <div className="min-h-screen p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//       <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-md border" />
//       <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md border" />
//     </div>
//   )
// }

'use client'

import React, { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'

const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // make sure this env variable is set
const server = 'wss://webliveroom[region].zego.im/ws' // adjust this URL for your region

export default function CallRoom() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const params = useParams() // useParams returns an object with your dynamic params
  const roomId = params.roomId as string

  useEffect(() => {
    if (!roomId) return

    const userID = `user_${Math.floor(Math.random() * 10000)}`
    const userName = `Guest`

    fetch('/api/auth/meeting-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID }),
    })
      .then(res => res.json())
      .then(async ({ token }) => {
        // Use a type assertion to bypass the missing type on createEngine
        const zg = (ZegoExpressEngine as any).createEngine(appID, server)

        await zg.loginRoom(roomId, token, { userID, userName }, { userUpdate: true })

        zg.createStream({ camera: { video: true, audio: true } }).then((localStream: MediaStream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream
          }
          zg.startPublishingStream('localStream', localStream)
        })

        zg.on('roomStreamUpdate', (roomID: string, updateType: string, streamList: any[]) => {
          if (updateType === 'ADD' && streamList.length > 0) {
            const remoteStreamID = streamList[0].streamID
            zg.startPlayingStream(remoteStreamID).then((remoteStream: MediaStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
              }
            })
          }
        })
      })
      .catch(err => console.error('Error fetching token or joining room:', err))
  }, [roomId])

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-md border" />
      <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md border" />
    </div>
  )
}
