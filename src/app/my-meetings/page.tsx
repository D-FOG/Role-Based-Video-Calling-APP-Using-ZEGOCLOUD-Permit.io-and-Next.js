// 'use client'

// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { Check, Copy, ArrowLeft } from 'lucide-react'
// import Link from 'next/link'

// export default function MyMeetingsPage() {
//   const { status } = useSession()
//   const [meetings, setMeetings] = useState<any[]>([])
//   const [copiedId, setCopiedId] = useState<string | null>(null)

//   useEffect(() => {
//     if (status === 'authenticated') {
//       fetch('/api/my-meetings')
//         .then(res => res.json())
//         .then(data => setMeetings(data))
//     }
//   }, [status])

//   const handleCopy = async (roomId: string) => {
//     await navigator.clipboard.writeText(roomId)
//     setCopiedId(roomId)
//     setTimeout(() => setCopiedId(null), 2000)
//   }

//   if (status === 'loading')
//     return <p className="text-center mt-10 text-gray-600">Loading...</p>
//   if (status === 'unauthenticated')
//     return <p className="text-center mt-10 text-red-500">Please sign in to view your meetings</p>

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-6">
//       <div className="container mx-auto px-4">
//         {/* Back Button */}
//         <div className="mb-6">
//           <Link href="/create">
//             <button className="flex items-center text-blue-500 hover:text-blue-600">
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back to Meeting Page
//             </button>
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">My Scheduled Meetings</h1>

//         {meetings.length === 0 ? (
//           <p className="text-center text-blue-700">No meetings scheduled yet.</p>
//         ) : (
//           <ul className="space-y-6">
//             {meetings.map((meeting) => (
//               <li
//                 key={meeting._id}
//                 className="bg-white border border-blue-200 p-6 rounded-2xl shadow hover:shadow-md transition-all"
//               >
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold text-blue-900">{meeting.title}</h2>
//                   <button
//                     onClick={() => handleCopy(meeting.roomId)}
//                     className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
//                   >
//                     {copiedId === meeting.roomId ? (
//                       <>
//                         <Check className="w-4 h-4" />
//                         Copied
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="w-4 h-4" />
//                         Copy Room ID
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 <p className="text-sm text-blue-700 mt-1 mb-4">
//                   Created on {new Date(meeting.createdAt).toLocaleString()}
//                 </p>

//                 <div className="space-y-2 text-blue-800 text-sm">
//                   <p>
//                     <span className="font-medium">Room ID:</span> {meeting.roomId}
//                   </p>
//                   <p>
//                     <span className="font-medium">Location:</span> {meeting.location}
//                   </p>
//                   <p>
//                     <span className="font-medium">Description:</span> {meeting.description || 'No description provided'}
//                   </p>
//                   <p>
//                     <span className="font-medium">Guests:</span>{' '}
//                     {meeting.guestEmails.length ? meeting.guestEmails.join(', ') : 'None'}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Copy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MyMeetingsPage() {
  const { status } = useSession()
  const [meetings, setMeetings] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/my-meetings')
        .then(res => res.json())
        .then(data => setMeetings(data))
    }
  }, [status])

  const handleCopy = async (roomId: string) => {
    await navigator.clipboard.writeText(roomId)
    setCopiedId(roomId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (status === 'loading')
    return <p className="text-center mt-10 text-gray-600">Loading...</p>
  if (status === 'unauthenticated')
    return <p className="text-center mt-10 text-red-500">Please sign in to view your meetings</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-6">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/create">
            <button className="flex items-center text-blue-500 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Meeting Page
            </button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">My Scheduled Meetings</h1>

        {meetings.length === 0 ? (
          <p className="text-center text-blue-700">No meetings scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-white rounded-2xl p-6 shadow-[8px_8px_20px_#cbd5e1,_-8px_-8px_20px_#ffffff] transition-all hover:shadow-[4px_4px_10px_#cbd5e1,_-4px_-4px_10px_#ffffff]"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-blue-900">{meeting.title}</h2>
                  <button
                    onClick={() => handleCopy(meeting.roomId)}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    {copiedId === meeting.roomId ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Room ID
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-blue-700 mb-4">
                  Created on {new Date(meeting.createdAt).toLocaleString()}
                </p>

                <div className="space-y-2 text-blue-800 text-sm">
                  <p>
                    <span className="font-medium">Room ID:</span> {meeting.roomId}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {meeting.location}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span> {meeting.description || 'No description provided'}
                  </p>
                  <p>
                    <span className="font-medium">Guests:</span>{' '}
                    {meeting.guestEmails.length ? meeting.guestEmails.join(', ') : 'None'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
