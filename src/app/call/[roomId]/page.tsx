'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

interface ZegoInstance {
    joinRoom: (options: {
      container: HTMLElement;
      scenario: { mode: string };
      sharedLinks?: { name: string; url: string }[];
    }) => void;
    leaveRoom?: () => void;
    destroy?: () => void;
}
export default function CallRoom() {
  const params = useParams()
  const roomId = params.roomId as string
  const containerRef = useRef<HTMLDivElement>(null)
  const [zegoInstance, setZegoInstance] = useState<ZegoInstance | null >(null)
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
        const res = await fetch('/api/meeting-token', {
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
        const zp = ZegoUIKitPrebuilt.create(kitTokenTest) as unknown as ZegoInstance
        setZegoInstance(zp)
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
    
    return () => {
        // Call endCall to cleanup when component unmounts
        endCall();
    };
  }, [roomId, appID, serverSecret])

  const endCall = () => {
    if (zegoInstance) {
      // Call the leaveRoom or destroy method as provided by the SDK.
      if (typeof zegoInstance.leaveRoom === 'function') {
        zegoInstance.leaveRoom()
      }
      if (typeof zegoInstance.destroy === 'function') {
        zegoInstance.destroy()
      }
      setZegoInstance(null)
      joinedRef.current = false
    }
  }

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
