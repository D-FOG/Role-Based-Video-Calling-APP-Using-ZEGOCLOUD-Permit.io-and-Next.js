'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Image 
              src="/img/logo.png" 
              alt="Logo" 
              width={230} 
              height={61} 
              className="w-auto h-12"
            />
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-blue-600">
            No account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

