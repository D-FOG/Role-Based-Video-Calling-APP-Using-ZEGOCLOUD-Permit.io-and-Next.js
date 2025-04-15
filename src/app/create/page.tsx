'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Video } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function MeetingPage() {
    const { status } = useSession()
    const router = useRouter()
    const [roomInput, setRoomInput] = useState('')

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin")
        }
    }, [status, router])

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-8 max-w-2xl">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={231}
              height={61}
              className="transition-transform hover:scale-105"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-blue-500">Meeting.. Scheduling..</span>
              <br />
              <span className="text-blue-900">& Collaboration</span>
            </h1>
            <p className="text-blue-700 text-lg md:text-xl">
              Schedule or start an instant interaction with fellow team members now!
            </p>
            <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/new-meet">
                <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                    <Video className="mr-2 h-5 w-5" />
                    Schedule your Meeting
                </Button>
                </Link>
                <Link href="/my-meetings">
                <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-50">
                    View My Meetings
                </Button>
                </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input 
                    placeholder="Enter a code or link here"
                    value={roomInput}
                    onChange={e => setRoomInput(e.target.value)}
                    className="w-full"
                />
                <Button 
                    onClick={() => router.push(`/call/${roomInput}`)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                >
                    Join
                </Button>
            </div>
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Image
              src="/img/s-co.png"
              alt="Collaboration"
              width={544}
              height={529}
              className="transition-transform hover:scale-105 w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

