'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useSession } from 'next-auth/react'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { Wifi, WifiOff } from 'lucide-react'
import { permit } from '@/lib/permit'

interface ZegoInstance {
  joinRoom: (options: any) => void
  leaveRoom?: () => void
  destroy?: () => void
}

// Explicit type for network stats
interface NetworkStats {
  uplink: number
  downlink: number
}

export default function CallRoom() {
  return (
    <ToastContainer>
      <CallRoomContent />
    </ToastContainer>
  )
}

function CallRoomContent() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const roomId = params.roomId as string
  const containerRef = useRef<HTMLDivElement>(null)
  const zegoInstanceRef = useRef<ZegoInstance | null>(null)
  const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET as string
  const joinedRef = useRef(false)
  const [networkQuality, setNetworkQuality] = useState(3)

  const getTokenAndJoin = async () => {
    if (joinedRef.current) {
      console.warn('Already joined, skipping second joinRoom')
      return
    }
    
     if (status !== 'authenticated' || !session?.user) {
      addToast({ title: 'Auth Error', description: 'User not authenticated', variant: 'destructive' })
      return
    }

    // 1️⃣ Cleanup any previous session
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.leaveRoom?.()
      zegoInstanceRef.current.destroy?.()
      zegoInstanceRef.current = null
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    joinedRef.current = false

    //const userI_D = session.user.id as string
    console.log('User ID:', session)
    // 2️⃣ Generate a new token (dev/test only)
    //const userID = `user_${Date.now()}`
    const userID = session.user.id as string
    const userName = `Guest_${userID}`

    async function checkPermit(user: string, action: string, resource: string) {
    const res = await fetch('/api/permit-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, action, resource })
    })
    if (!res.ok) throw new Error(await res.text())
    const { allowed } = await res.json() as { allowed: boolean }
    return allowed
  }

    // fetch permissions
    const canListen = await checkPermit(userID, 'listen', roomId)
    const canSpeak = await checkPermit(userID, 'speak', roomId)
    const canModerate = await checkPermit(userID, 'moderate', roomId)

    console.log('Permissions:', { canListen, canSpeak, canModerate });

    // All available buttons
    const allButtons = [
      'toggleMicrophoneButton',
      'toggleCameraButton',
      'toggleScreenSharingButton',
      'textChatButton',
      'userListButton',
      'switchCameraButton',
      'switchAudioOutputButton',
      'leaveButton',
      'muteAllAudioButton',
      'muteAllVideoButton',
      'beautyButton',
      'deviceToggleButton',
      'fullScreenButton',
      'raiseHandButton',
      'coHostButton',
      'moreButton',
      'recordingButton',
      'whiteboardButton',
      'liveButton'
    ]

    // Filter buttons by role
    let buttons: string[] = ['leaveButton']
    if (canModerate) {
      buttons = allButtons.slice() // host sees everything
    } else if (canSpeak) {
      // speaker sees speak+listen controls
      buttons = allButtons.filter(key => [
        'toggleMicrophoneButton',
        'toggleCameraButton',
        'textChatButton',
        'userListButton',
        'raiseHandButton',
        'muteAllAudioButton',
        'beautyButton',
        'deviceToggleButton',
        'fullScreenButton',
        'switchCameraButton',
        'switchAudioOutputButton',
        'leaveButton'
      ].includes(key))
    } else if (canListen) {
      // listener sees minimal controls
      buttons = ['toggleSpeakerButton', 'textChatButton', 'leaveButton']
    }else {
      buttons = allButtons.slice()   // show everything
    }


    // // determine buttons
    // const buttons = ['leaveButton']
    // if (canListen) buttons.splice(0, 0, 'toggleSpeaker')
    // if (canSpeak) buttons.unshift('toggleMicrophoneButton', 'toggleCameraButton')
    // if (canModerate) buttons.push('userListButton')

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userID,
      userName,
    )
    console.log('Test Token:', kitToken)

    // 3️⃣ Create and join
    const zp = ZegoUIKitPrebuilt.create(kitToken) as unknown as ZegoInstance
    zegoInstanceRef.current = zp

    zp.joinRoom({
      container: containerRef.current!,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      sharedLinks: [{ name: 'Copy Link', url: window.location.href }],
      bottomMenuBarConfig: { buttons, maxCount: buttons.length },

      onNetworkQuality: (stats: NetworkStats) => {
        if (stats?.uplink != null) setNetworkQuality(stats.uplink)
      },
      onJoinRoom: () => {
        joinedRef.current = true
        addToast({ title: 'Meeting Joined', description: roomId, variant: 'success' })
      },
      onLeaveRoom: () => {
        joinedRef.current = false
        addToast({ title: 'Meeting Ended', description: '', variant: 'default' })
      },
      onError: (err: any) => {
        joinedRef.current = false
        console.error('Zego error:', err)
        console.error('Zego full error object:', err);
        addToast({
          title: 'Meeting Error',
          description: `${err.code || ''} ${err.message || JSON.stringify(err)}`,
          variant: 'destructive',
        })
      },
    })
  }

  useEffect(() => {
    if (!roomId || joinedRef.current) return

    const requestMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        stream.getTracks().forEach(t => t.stop())
        getTokenAndJoin()
      } catch (err: any) {
        console.error('Media error:', err)
        addToast({ title: 'Media Permission Error', description: err.message, variant: 'destructive' })
      }
    }

    requestMedia()

    return () => {
      // full cleanup on unmount
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.leaveRoom?.()
        zegoInstanceRef.current.destroy?.()
        zegoInstanceRef.current = null
      }
      joinedRef.current = false
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [roomId])

  const endCall = (navigate = true) => {
    const inst = zegoInstanceRef.current
    if (inst) {
      inst.leaveRoom?.()
      inst.destroy?.()
      zegoInstanceRef.current = null
      joinedRef.current = false
    }
    if (navigate) router.push('/create')
  }

  const NetworkQualityIndicator = () => {
    if (networkQuality >= 4) return <Wifi size={24} className="text-green-500" />
    if (networkQuality >= 2) return <Wifi size={24} className="text-yellow-500" />
    if (networkQuality >= 1) return <Wifi size={24} className="text-red-500" />
    return <WifiOff size={24} className="text-red-500" />
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-md flex items-center gap-2">
        <NetworkQualityIndicator />
        <span className="text-white text-sm">
          {networkQuality >= 4 ? 'Excellent' :
           networkQuality >= 2 ? 'Good' :
           networkQuality >= 1 ? 'Poor' : 'Disconnected'}
        </span>
        <button onClick={() => endCall(true)} className="ml-2 px-2 py-1 bg-red-600 text-white rounded">Leave</button>
      </div>
    </div>
  )
}

