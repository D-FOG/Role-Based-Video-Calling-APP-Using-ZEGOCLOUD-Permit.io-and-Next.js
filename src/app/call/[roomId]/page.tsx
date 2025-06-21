'use client'

import React, { useEffect, useRef, useState} from 'react'
import { useParams } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface ZegoInstance {
    joinRoom: (options: {
      container: HTMLElement;
      scenario: { mode: string };
      sharedLinks?: { name: string; url: string }[];
      showScreenSharingButton?: boolean;
      showRecordingButton?: boolean;
      showTextChat?: boolean;
      showUserList?: boolean;
      turnOnMicrophoneWhenJoining?: boolean;
      turnOnCameraWhenJoining?: boolean;
      showMyCameraToggleButton?: boolean;
      showMyMicrophoneToggleButton?: boolean;
      showAudioVideoSettingsButton?: boolean;
      onNetworkQuality?: (stats: any) => void;
      onUserJoin?: (users: any[]) => void;
      onUserLeave?: (users: any[]) => void;
      onError?: (error: any) => void;
      showLeavingView?: boolean;
      maxUsers?: number;
      showNonVideoUser?: boolean;
      showOnlyAudioUser?: boolean;
      useFrontFacingCamera?: boolean;
      onLiveStart?: () => void;
      onLiveEnd?: () => void;
      onJoinRoom?: () => void;
      onLeaveRoom?: () => void;
    }) => void;
    leaveRoom?: () => void;
    destroy?: () => void;
}
export default function CallRoom() {
  return (
    <ToastContainer>
      <CallRoomContent />
    </ToastContainer>
  )
}

function CallRoomContent() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const roomId = params.roomId as string
  const containerRef = useRef<HTMLDivElement>(null)
  const zegoInstanceRef = useRef<ZegoInstance | null>(null)
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!) // e.g., 1234567890
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!
  const joinedRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [networkQuality, setNetworkQuality] = useState<number>(3) // 0-5 scale, 5 being best
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    if (!roomId || joinedRef.current) return;

    const userID = `user_${Math.floor(Math.random() * 10000)}`
    const userName = `Guest_${userID}`

    const getTokenAndJoin = async () => {
      try {
        // From server side it initializes the token but fails to join the call due to authentication error
        const res = await fetch('/api/meeting-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID, roomID: roomId })
        })

        if (!res.ok) {
            const errorText = await res.text();
            addToast({
              title: 'Connection Error',
              description: `Failed to connect to meeting server: ${errorText}`,
              variant: 'destructive',
              duration: 5000
            });
            throw new Error(`Error fetching token: ${errorText}`);
        }

        const data = await res.json()
        const token = data.token
        console.log('Received token:', token);

        // Using the token from the client side to join the call
        const kitTokenTest = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userID, userName);
        const zp = ZegoUIKitPrebuilt.create(kitTokenTest) as unknown as ZegoInstance
        zegoInstanceRef.current = zp;
        
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
          // Custom controls for screen sharing, recording, and chat
          showScreenSharingButton: true,
          showRecordingButton: true,
          showTextChat: true,
          
          // Participant management features
          showUserList: true,
          maxUsers: 50,
          showNonVideoUser: true,
          
          // Default device settings
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          useFrontFacingCamera: true,
          
          // Event handlers
          onNetworkQuality: (stats) => {
            // Update network quality indicator (0-5 scale, 5 being best)
            if (stats && stats.uplink) {
              setNetworkQuality(stats.uplink);
            }
          },
          onUserJoin: (users) => {
            setParticipants(prevParticipants => {
              const newParticipants = [...prevParticipants];
              users.forEach(user => {
                if (!newParticipants.find(p => p.userID === user.userID)) {
                  newParticipants.push(user);
                }
              });
              return newParticipants;
            });
            
            addToast({
              title: 'Participant Joined',
              description: `${users.length} participant(s) joined the meeting`,
              variant: 'success',
              duration: 3000
            });
          },
          onUserLeave: (users) => {
            setParticipants(prevParticipants => 
              prevParticipants.filter(p => !users.find(u => u.userID === p.userID))
            );
            
            addToast({
              title: 'Participant Left',
              description: `${users.length} participant(s) left the meeting`,
              variant: 'default',
              duration: 3000
            });
          },
          onError: (error) => {
            console.error('Zego error:', error);
            addToast({
              title: 'Meeting Error',
              description: `An error occurred: ${error.message || 'Unknown error'}`,
              variant: 'destructive',
              duration: 5000
            });
          },
          onJoinRoom: () => {
            addToast({
              title: 'Meeting Joined',
              description: `Successfully joined room: ${roomId}`,
              variant: 'success',
              duration: 3000
            });
          },
          onLeaveRoom: () => {
            addToast({
              title: 'Meeting Ended',
              description: 'You have left the meeting',
              variant: 'default',
              duration: 3000
            });
          }
        })

        joinedRef.current = true;
      } catch (error) {
        console.error('Failed to get token or join room:', error);
        addToast({
          title: 'Connection Failed',
          description: `Could not join the meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive',
          duration: 5000
        });
      }
    }

    getTokenAndJoin()

    return () => {
        // Call endCall to cleanup when component unmounts
        endCall();
    };
  }, [roomId, appID, serverSecret])

//   const endCall = () => {
//     if (zegoInstance) {
//       // Call the leaveRoom or destroy method as provided by the SDK.
//       if (typeof zegoInstance.leaveRoom === 'function') {
//         zegoInstance.leaveRoom()
//       }
//       if (typeof zegoInstance.destroy === 'function') {
//         zegoInstance.destroy()
//       }
//       setZegoInstance(null)
//       joinedRef.current = false
//     }
//   }
    const endCall = () => {
        const instance = zegoInstanceRef.current;
        if (instance) {
        if (typeof instance.leaveRoom === 'function') {
            instance.leaveRoom();
        }
        if (typeof instance.destroy === 'function') {
            instance.destroy();
        }
        zegoInstanceRef.current = null;
        joinedRef.current = false;
        }
    };

  // Network quality indicator component
  const NetworkQualityIndicator = () => {
    if (networkQuality >= 4) {
      return <Wifi className="text-green-500" size={24} />;
    } else if (networkQuality >= 2) {
      return <Wifi className="text-yellow-500" size={24} />;
    } else if (networkQuality >= 1) {
      return <Wifi className="text-red-500" size={24} />;
    } else {
      return <WifiOff className="text-red-500" size={24} />;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Main video container */}
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
      
      {/* Network quality indicator overlay */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-md flex items-center gap-2">
        <NetworkQualityIndicator />
        <span className="text-white text-sm">
          {networkQuality >= 4 ? 'Excellent' : 
           networkQuality >= 2 ? 'Good' : 
           networkQuality >= 1 ? 'Poor' : 'Disconnected'}
        </span>
      </div>
    </div>
  )
}
