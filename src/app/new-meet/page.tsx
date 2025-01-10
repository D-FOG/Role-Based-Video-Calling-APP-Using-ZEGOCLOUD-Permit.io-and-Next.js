'use client'

import React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MapPin, Bell, Bold, Italic, Underline, Strikethrough } from 'lucide-react'

export default function NewMeetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto my-10 px-4 text-3xl font-bold text-blue-900">
        Schedule Meet
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <Input placeholder="Add title here" className="text-lg" />
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <Input placeholder="Add Location" className="pl-10" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Label htmlFor="notification" className="flex items-center gap-2 mb-2">
                  <Bell className="text-blue-500" />
                  Email Notification
                </Label>
                <Select>
                  <SelectTrigger id="notification">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-grow">
                <Label htmlFor="reminder-time" className="mb-2">Reminder Time</Label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger id="reminder-time">
                      <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Textarea 
                placeholder="Add description..." 
                className="min-h-[200px] border-0 focus:ring-0"
              />
              <div className="flex items-center gap-2 p-2 bg-blue-50 border-t">
                <Button variant="ghost" size="icon"><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Underline className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Strikethrough className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Guest Invite</h2>
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={103}
                height={29}
                className="transition-transform hover:scale-105"
              />
            </div>
            
            <Input type="email" placeholder="Add guest email" className="mb-8" />
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Guest Permission</h3>
              <hr className="mb-4" />
              <div className="space-y-4">
                {['Modify event', 'Invite others', 'See guest list'].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox id={permission.toLowerCase().replace(' ', '-')} />
                    <Label htmlFor={permission.toLowerCase().replace(' ', '-')}>{permission}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">Save meeting</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

