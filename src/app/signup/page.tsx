'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Image 
              src="/img/logo.png" 
              alt="Logo" 
              width={200} 
              height={54} 
              className="w-auto h-12 transition-transform hover:scale-105"
            />
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                type="text"
                id="first_name"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                type="text"
                id="last_name"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4 text-blue-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Sign Up
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-blue-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

