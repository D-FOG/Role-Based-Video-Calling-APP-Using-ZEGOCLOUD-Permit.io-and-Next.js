'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useSession } from 'next-auth/react'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { Wifi, WifiOff } from 'lucide-react'
import { io as ClientIO } from 'socket.io-client'

interface ZegoInstance {
  joinRoom: (options: unknown) => void
  leaveRoom?: () => void
  destroy?: () => void
}

interface NetworkStats {
  uplink: number
  downlink: number
}

interface Participant {
  userID: string
  userName: string
}


export default function CallRoom() {
  return (
    <ToastContainer>
      <CallRoomContent />
    </ToastContainer>
  )
}

function CallRoomContent() {
  const { addToast } = useToast()
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()

  const roomId = params?.roomId as string
  const containerRef = useRef<HTMLDivElement>(null)
  const zegoInstanceRef = useRef<ZegoInstance | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showParticipants, setShowParticipants] = useState(false)
  const [participantRoles, setParticipantRoles] = useState<Record<string, { canSpeak: boolean, canListen: boolean }>>({})
  const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET as string
  const joinedRef = useRef(false)
  const [isModerator, setIsModerator] = useState(false)
  const [networkQuality, setNetworkQuality] = useState(3)
  const socketRef = useRef<ReturnType<typeof ClientIO> | null>(null)

  useEffect(() => {
    if (!roomId) router.push('/');
  }, [roomId, router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
    }
  }, [status, router])
  
  const getUserPermissions = useCallback(
    async (userId: string, userEmail?: string) => {
      if (!userEmail) {
        userEmail = await getUserEmailFromSocket(userId)
      }
      const user = { id: userId, email: userEmail }
      const resourceId = `zego-one:${roomId}`

      const [canSpeak, canListen] = await Promise.all([
        fetch('/api/permit-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, action: 'speak', resourceId }),
        }).then(r => r.json()).then(r => r.allowed),

        fetch('/api/permit-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, action: 'listen', resourceId }),
        }).then(r => r.json()).then(r => r.allowed),
      ])

      return { canSpeak, canListen }
    },
    [roomId] // dependencies
  )


  useEffect(() => {
    if (socketRef.current?.connected) {
      console.log('Cleaning up previous socket connection before creating new one...')
      socketRef.current.disconnect()
    }
    console.log('🔄 Initializing socket connection...')
    //let socket: ReturnType<typeof ClientIO> | null = null
    
    // Create socket connection directly without the initial fetch
    const createSocketConnection = () => {
      if (!session) {
        console.warn('No session found. Skipping join-room emit.')
        return
      }
      console.log('[From createSocketConnection] Session:', session)
      try {
        console.log('Creating socket.io connection...')
        
        // Create socket with improved configuration
        socketRef.current = ClientIO(window.location.origin, { 
          path: '/api/sockets/socket.io',
          reconnectionAttempts: 10,         // Increased from 5 to 10
          reconnectionDelay: 1000,
          timeout: 45000,                   // Increased from 30000 to 45000 to match server
          transports: ['websocket', 'polling'],
          forceNew: true,
          autoConnect: true
        })

        socketRef.current.onAny((ev, ...args) => {
          console.log('[socket event]', ev, args)
        })

        socketRef.current.onAny((event, ...args) => {
          console.log('socket event', event, args)
        })
        
        // Socket event listeners
        socketRef.current!.on('connect', () => {
          console.log(`Socket connected with ID: ${socketRef.current!.id}`)
          // Join room after successful connection
          socketRef.current!.emit('join-room', {
            roomId,
            userId: session.user.id,
            email: session.user.email,
            name: session.user.firstName + ' ' + session.user.lastName,
          })
          console.log('Emitting join-room with:', {
            roomId,
            userId: session.user.id,
            email: session.user.email,
            name: session.user.lastName + ' ' + session.user.firstName,
          })
        })
        
        socketRef.current!.on('room-joined', (data: { roomId: string; userId: string }) => {
          console.log(`Successfully joined room:`, data)
          addToast({
            title: 'Connected to Room',
            description: `You've successfully joined the meeting room.`,
            variant: 'default'
          })
        })

        socketRef.current!.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error)
          
          // Implement retry logic for connection errors
          let retryCount = 0;
          const maxRetries = 3;
          const retryInterval = 5000; // 5 seconds
          
          const retryConnection = () => {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying after connection error (${retryCount}/${maxRetries}) in ${retryInterval/1000}s...`);
              
              setTimeout(() => {
                console.log('Attempting to reconnect after error...');
                // Force reconnection
                socketRef.current?.connect();
              }, retryInterval);
            }
          };
          
          // Start retry process
          retryConnection();
          
          addToast({
            title: 'Connection Error',
            description: `Failed to establish socket connection: ${error.message}. Automatically retrying (${retryCount}/${maxRetries})... If problems persist, please refresh the page.`,
            variant: 'destructive'
          })
        })
        
        socketRef.current!.on('connect_timeout', (timeout: number) => {
          console.error('Socket connection timeout:', timeout)
          
          // Implement retry logic for timeout specifically
          let retryCount = 0;
          const maxRetries = 3;
          const retryInterval = 5000; // 5 seconds
          
          const retryConnection = () => {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying connection (${retryCount}/${maxRetries}) in ${retryInterval/1000}s...`);
              
              setTimeout(() => {
                console.log('Attempting to reconnect...');
                // Force reconnection
                socketRef.current?.connect();
              }, retryInterval);
            }
          };
          
          // Start retry process
          retryConnection();
          
          addToast({
            title: 'Connection Timeout',
            description: `Socket connection timed out. Automatically retrying (${retryCount}/${maxRetries})... If problems persist, please refresh the page.`,
            variant: 'destructive'
          })
        })
        
        socketRef.current!.on('reconnect', (attemptNumber: number) => {
          console.log(`Socket reconnected after ${attemptNumber} attempts`)
          addToast({
            title: 'Reconnected',
            description: 'Socket connection has been restored.',
            variant: 'default'
          })
        })
        
        socketRef.current!.on('reconnect_error', (error: Error) => {
          console.error('Socket reconnection error:', error)
        })
        
        socketRef.current!.on('reconnect_failed', () => {
          console.error('Socket reconnection failed after all attempts')
          addToast({
            title: 'Reconnection Failed',
            description: 'Unable to reconnect to the server. Please refresh the page.',
            variant: 'destructive'
          })
        })

        socketRef.current?.on('kicked', () => {
          console.log('! you where kicked from the room !')
          addToast({ title: 'Removed', description: 'You have been removed from this room.', variant: 'destructive' })
          // Leave the Zego room
          if (zegoInstanceRef.current) {
            zegoInstanceRef.current.leaveRoom?.()
            zegoInstanceRef.current.destroy?.()
            zegoInstanceRef.current = null
          }

          joinedRef.current = false
          if (containerRef.current) containerRef.current.innerHTML = ''

          // Then redirect user
          router.push(status === 'authenticated' ? '/create' : '/signin')
        })
        
        socketRef.current!.on('role-changed', async ({ userId, newRole }: { userId: string; newRole: string }) => {
          console.log(`Role changed event: User ${userId} role changed to ${newRole}`)
          if (userId === session?.user?.id) {
            console.log('Reloading page due to role change')
            window.location.reload()
          }
          if (session?.user && userId === session.user.id) {
            console.log('Updating local permissions without reload')
            const email = session.user.email ?? undefined
            const perms = await getUserPermissions(userId, email)
            setParticipantRoles(prev => ({
              ...prev,
              [userId]: perms
            }))
          } else {
            // Also update the roles for other users so the moderator panel updates
            const perms = await getUserPermissions(userId)
            setParticipantRoles(prev => ({
              ...prev,
              [userId]: perms
            }))
          }

        })
        
        socketRef.current!.on('disconnect', (reason: string) => {
          console.log(`Socket disconnected: ${reason}`)
          if (reason === 'io server disconnect') {
            // The server has forcefully disconnected the socket
            addToast({
              title: 'Disconnected',
              description: 'You were disconnected by the server. Please refresh the page.',
              variant: 'destructive'
            })
          } else if (reason === 'transport close') {
            // The connection was closed (e.g., user lost internet)
            addToast({
              title: 'Connection Lost',
              description: 'Connection to the server was lost. Attempting to reconnect...',
              variant: 'destructive'
            })
          }
        })
        
        socketRef.current!.on('error', (error: Error) => {
          console.error('Socket error:', error)
          addToast({
            title: 'Socket Error',
            description: `An error occurred: ${error.message || 'Unknown error'}`,
            variant: 'destructive'
          })
        })
      } catch (error: unknown) {
        console.error('Error creating socket connection:', error)
        addToast({
          title: 'Connection Error',
          description: `Failed to create socket connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive'
        })
      }
    }
    
    // Create socket connection directly
    ;(async () => {
      try {
        console.log('Fetching /api/sockets to init server...')
        await fetch('/api/sockets')
        console.log('Socket server booted — connecting client...')
        await new Promise(resolve => setTimeout(resolve, 300)) 
        createSocketConnection()
      } catch (err) {
        console.error('Failed to init socket API:', err)
        addToast({
          title: 'Socket Init Error',
          description: 'Failed to contact socket server. Please refresh.',
          variant: 'destructive'
        })
      }
    })()

    return () => {
      console.log('Cleaning up socket connection')
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [roomId, session, router, status, addToast, getUserPermissions])

  function getUserEmailFromSocket(userId: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      if (!socketRef.current) {
        console.warn('No socket connection found when trying to get user email.')
        return resolve(undefined)
      }

      socketRef.current.emit('get-user-meta', userId, (data: { email?: string }) => {
        console.log(`Fetched user meta for ${userId}:`, data)
        resolve(data.email)
      })
    })
  }


  function kickUser(userId: string) {
    console.log('kicking user – emitting kick-user for', userId)
    socketRef.current?.emit('kick-user', { roomId, userId })
    addToast({ title: 'User Kicked', description: `${userId} has been removed`, variant: 'destructive' })
  }

  // **NEW**: hit your API route to swap roles
  async function updateUserRole(userId: string, newRole: 'speaker' | 'listener') {
    try {
      const res = await fetch('/api/role-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roomId, newRole })
      })
      if (!res.ok) {
        const { error } = await res.json()
        console.log('Role update error:', error)
        throw new Error(error || 'Failed to update role')
      }
      addToast({
        title: 'Role Updated',
        description: `${userId} → ${newRole}`,
        variant: 'success'
      })
    } catch (err: unknown) {
      console.error('Role update error:', err)
      const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error'
      const isUserNotFound = msg.includes('USER_NOT_FOUND') || msg.includes('we could not find')
      console.error('Role update failed:', isUserNotFound)
      addToast({
        title: 'Role Update Failed',
        description: 'This user hasn’t signed up yet. Ask them to sign up before promoting!!.',
        variant: 'destructive'
      })
    }
  }

  const getTokenAndJoin = useCallback(async () => {
    if (!session?.user?.id) return

    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.leaveRoom?.()
      zegoInstanceRef.current.destroy?.()
      zegoInstanceRef.current = null
    }

    if (containerRef.current) containerRef.current.innerHTML = ''
    joinedRef.current = false
    console.log(session);

    const userID = session.user.id as string
    const firstName = session.user.firstName || 'Guest'
    const lastName = session.user.lastName || `${userID.slice(0, 4)}`
    const userName = `${lastName} ${firstName}`

    async function checkPermit(action: string, resource: string) {
      if (!session?.user) return false
      const user = {
        id: session.user.id,
        email: session.user.email,
      }
      const resourceId = `zego-one:${resource}`
      // const resourceId = `zego-one:${roomId}` // Ensure resource is in the correct format
      const res = await fetch('/api/permit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, action, resourceId })
      })
      if (!res.ok) throw new Error(await res.text())
      const { allowed } = await res.json() as { allowed: boolean }
      return allowed
    }

    const updateParticipantPermissions = async (users: Participant[]) => {
      const roles: Record<string, { canSpeak: boolean, canListen: boolean }> = {}
      await Promise.all(users.map(async ({ userID }) => {
        const perms = await getUserPermissions(userID)
        roles[userID] = perms
      }))
      setParticipantRoles(prev => ({ ...prev, ...roles }))
    }

    const canListen = await checkPermit('listen', roomId)
    const canSpeak = await checkPermit('speak', roomId)
    const canModerate = await checkPermit('moderate', roomId)
    console.log('Permissions:', { canListen, canSpeak, canModerate });

    setIsModerator(canModerate)

    let buttons: string[] = ['leaveButton']
    let showTextChat = true;
    const showRaiseHand = true;
    //const showMyMicrophoneToggleButton = false
    // let turnOnMicrophoneWhenJoining = false
    // let turnOnCameraWhenJoining = false

    if (canModerate) {
      buttons = [
        'toggleMicrophoneButton',
        'toggleCameraButton',
        'toggleScreenSharingButton',
        'textChatButton',
        'raiseHandButton',
        'userListButton',
        'coHostButton',
        'moreButton',
        'leaveButton'
      ]
      // turnOnMicrophoneWhenJoining = true
      // turnOnCameraWhenJoining     = true
    } else if (canSpeak) {
      buttons = [
        'toggleMicrophoneButton',
        'toggleCameraButton',
        'textChatButton',
        'raiseHandButton',
        'leaveButton'
      ]
      // turnOnMicrophoneWhenJoining = true
      // turnOnCameraWhenJoining     = true
    } else {
      buttons = [
        'textChatButton',
        'raiseHandButton',
        'leaveButton'
      ]
      //showMyMicrophoneToggleButton
      showTextChat = true
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userID,
      userName,
    )

    const zp = ZegoUIKitPrebuilt.create(kitToken) as unknown as ZegoInstance
    zegoInstanceRef.current = zp

    zp.joinRoom({
      container: containerRef.current!,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      sharedLinks: [{ name: 'Copy Link', url: window.location.href }],
      bottomMenuBarConfig: { buttons, maxCount: buttons.length },

      showMyCameraToggleButton: canSpeak || canModerate,
      showMyMicrophoneToggleButton: canSpeak || canModerate,
      showAudioVideoSettingsButton: canSpeak || canModerate,
      showUserList: canSpeak || canModerate,
      showTextChat,
      showRaiseHandButton: showRaiseHand,
      showScreenSharingButton: canSpeak || canModerate,
      turnOnMicrophoneWhenJoining: canSpeak || canModerate,
      turnOnCameraWhenJoining: canSpeak || canModerate,

      onNetworkQuality: (stats: NetworkStats) => {
        if (stats?.uplink != null) setNetworkQuality(stats.uplink)
      },
      onJoinRoom: () => {
        joinedRef.current = true
        // setParticipants(prev => [...new Set([...prev, userID])])
        addToast({ title: 'Meeting Joined', description: roomId, variant: 'success' })
        setParticipants(prev => {
          const combined = [...prev, { userID, userName }]
          return combined
            .filter(p => p.userID !== session!.user!.id)
            .filter((v, i, a) => a.findIndex(x => x.userID === v.userID) === i)
        })
      },
      onUserListUpdate: (users: { userID: string; userName?: string }[]) => {
        console.log('Raw userListUpdate payload:', users)
        const normalized = users.map(u => ({
          userID: u.userID,
          userName: u.userName || u.userID,
        }))

        // Filter out the moderator's own ID:
        const filtered = normalized.filter(p => p.userID !== session!.user!.id)
        setParticipants(filtered)
        updateParticipantPermissions(normalized)

        console.log('participants after setState:', filtered)
      },
      onUserJoin: (users: { userID:string, userName?:string }[]) => {
        const normalizedUsers: Participant[] = users.map(u => ({
          userID: u.userID,
          userName: u.userName ?? u.userID, // fallback if undefined
        }))
        setParticipants(prev => {
          const m = new Map(prev.map(p => [p.userID, p]))
          normalizedUsers.forEach(u => m.set(u.userID, {
            userID: u.userID,
            userName: u.userName || u.userID
          }))
          return Array.from(m.values())
        })
        updateParticipantPermissions(normalizedUsers)
      },
      onUserLeave: (users: { userID:string }[]) => {
        setParticipants(prev =>
          prev.filter(p => !users.some(u => u.userID === p.userID))
        )
      },
      onLeaveRoom: () => {
        joinedRef.current = false
        addToast({ title: 'Meeting Ended', description: '', variant: 'default' })
      },
      onError: (err: unknown) => {
        joinedRef.current = false
        let errorMessage = 'unknown error'
        if (err instanceof Error) {
          const code = (err as Error & { code?: string }).code
          errorMessage = `${code || ''} ${err.message}`
        } else {
          errorMessage = JSON.stringify(err)
        }
        console.error('Zego error:', err)
        addToast({
          title: 'Meeting Error',
          description: errorMessage,
          variant: 'destructive',
        })
      },
    })
  }, [session, roomId, getUserPermissions, addToast, appID, serverSecret])

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!roomId || joinedRef.current || status !== 'authenticated') return

    const requestMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        stream.getTracks().forEach(t => t.stop())
        getTokenAndJoin()
      } catch (err: unknown) {
        console.error('Media error:', err)
        const message = err instanceof Error ? err.message : 'unknown error'
        addToast({ title: 'Media Permission Error', description: message, variant: 'destructive' })
      }
    }

    requestMedia()

    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.leaveRoom?.()
        zegoInstanceRef.current.destroy?.()
        zegoInstanceRef.current = null
      }
      joinedRef.current = false
      if (currentContainer) currentContainer.innerHTML = ''
    }
  }, [roomId, status, addToast, getTokenAndJoin])

  const endCall = (navigate = true) => {
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.leaveRoom?.()
      zegoInstanceRef.current.destroy?.()
      zegoInstanceRef.current = null
    }
    joinedRef.current = false
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
      <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 p-2 rounded-md flex items-center gap-2">
        <NetworkQualityIndicator />
        <span className="text-white text-sm">
          {networkQuality >= 4 ? 'Excellent' : networkQuality >= 2 ? 'Good' : networkQuality >= 1 ? 'Poor' : 'Disconnected'}
        </span>
        <button onClick={() => endCall(true)} className="ml-2 px-2 py-1 bg-red-600 text-white rounded">Leave</button>
        {isModerator && (
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded z-50"
          >
            {showParticipants ? 'Hide Panel' : 'Manage Participants'}
          </button>
        )}
      </div>
      {showParticipants && isModerator && (
        <div className="absolute bottom-20 right-4 z-50 bg-white p-4 rounded shadow-lg max-h-64 overflow-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Participants</h4>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-xs text-gray-500 hover:text-red-500"
            >
              Close
            </button>
          </div>
          {participants.map(({ userID, userName }) => {
            const roles = participantRoles[userID] || {}
            //const hasBoth = roles.canSpeak && roles.canListen
            const onlySpeaker = roles.canSpeak
            const onlyListen = !roles.canSpeak && roles.canListen
            const Viewer = !roles.canSpeak && !roles.canListen
            console.log('all roles', onlySpeaker, onlyListen, Viewer);

            return (
              <div key={userID} className="flex justify-between mb-1 text-sm">
                <span>{userName} ({userID.slice(0, 4)})</span>
                <div className="flex gap-1">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs disabled:opacity-40"
                    onClick={() => updateUserRole(userID, 'speaker')}
                    disabled={onlySpeaker}
                  >
                    Promote
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs disabled:opacity-40"
                    onClick={() => updateUserRole(userID, 'listener')}
                    disabled={onlyListen || Viewer}
                  >
                    Demote
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                    onClick={() => kickUser(userID)}
                  >
                    Kick
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}