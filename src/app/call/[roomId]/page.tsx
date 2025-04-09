// 'use client'

// import React, { useEffect, useRef } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { ZegoExpressEngine } from 'zego-express-engine-webrtc'

// const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // make sure this env variable is set
// const server = 'wss://webliveroom[region].zego.im/ws' // adjust this URL for your region

// export default function CallRoom() {
//   const localVideoRef = useRef<HTMLVideoElement>(null)
//   const remoteVideoRef = useRef<HTMLVideoElement>(null)
//   const router = useRouter()
//   const params = useParams() // useParams returns an object with your dynamic params
//   const roomId = params.roomId as string

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
//         // Use a type assertion to bypass the missing type on createEngine
//         const zg = (ZegoExpressEngine as any).createEngine(appID, server)

//         await zg.loginRoom(roomId, token, { userID, userName }, { userUpdate: true })

//         zg.createStream({ camera: { video: true, audio: true } }).then((localStream: MediaStream) => {
//           if (localVideoRef.current) {
//             localVideoRef.current.srcObject = localStream
//           }
//           zg.startPublishingStream('localStream', localStream)
//         })

//         zg.on('roomStreamUpdate', (roomID: string, updateType: string, streamList: any[]) => {
//           if (updateType === 'ADD' && streamList.length > 0) {
//             const remoteStreamID = streamList[0].streamID
//             zg.startPlayingStream(remoteStreamID).then((remoteStream: MediaStream) => {
//               if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = remoteStream
//               }
//             })
//           }
//         })
//       })
//       .catch(err => console.error('Error fetching token or joining room:', err))
//   }, [roomId])

//   return (
//     <div className="min-h-screen p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//       <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-md border" />
//       <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md border" />
//     </div>
//   )
// }

// 'use client'

// import React, { useEffect, useRef } from 'react'
// import { useParams } from 'next/navigation'
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

// export default function CallRoom() {
//   const params = useParams()
//   const roomId = params.roomId as string
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!roomId) return

//     // Retrieve your ZEGOCLOUD credentials from environment variables.
//     // For production, you should generate the kit token on your backend.
//     const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // e.g., 1234567890
//     const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET! // For test token generation only
//     const userID = `user_${Math.floor(Math.random() * 10000)}`
//     const userName = `Guest_${userID}`

//     // Option 1: Generate kit token on the client (for testing only)
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       roomId,
//       userID,
//       userName
//     )

//     // Option 2 (recommended for production): Fetch the token from your backend
//     // fetch('/api/meeting-token', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify({ userID, roomId }),
//     // })
//     //   .then(res => res.json())
//     //   .then(({ token }) => {
//     //     const kitToken = token;
//     //     // ... continue below
//     //   })

//     // Create the UI kit instance and join the room
//     const zp = ZegoUIKitPrebuilt.create(kitToken)
//     zp.joinRoom({
//       container: containerRef.current!,
//       scenario: {
//         mode: ZegoUIKitPrebuilt.VideoConference,
//       },
//       // Additional configuration options can be added here (e.g., enable chat, screen sharing, etc.)
//     })
//   }, [roomId])

//   return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
// }

'use client'

import React, { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

export default function CallRoom() {
  const params = useParams()
  const roomId = params.roomId as string
  const containerRef = useRef<HTMLDivElement>(null)
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // e.g., 1234567890
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!roomId || joinedRef.current) return;

    const userID = `user_${Math.floor(Math.random() * 10000)}`
    const userName = `Guest_${userID}`

    const getTokenAndJoin = async () => {
      try {
        //From server side it initializes the token but fails to join the call due to authentication error
        const res = await fetch('/api/auth/meeting-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID, roomID: roomId })
        })

        if (!res.ok) {
            throw new Error(`Error fetching token: ${await res.text()}`);
        }

        const data = await res.json()
        const token = data.token
        console.log('Received token:', token);

        //Using the token from the client side to join the call
        const kitTokenTest = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userID, userName);
        // console.log('Test Token:', kitTokenTest);
        const zp = ZegoUIKitPrebuilt.create(kitTokenTest)
        zp.joinRoom({
          container: containerRef.current!,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference
          },
          sharedLinks: [
            {
              name: 'Copy Link',
              url: window.location.href
            }
          ],
        })

        joinedRef.current = true;
      } catch (error) {
        console.error('Failed to get token or join room:', error)
      }
    }

    getTokenAndJoin()
  }, [roomId])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
