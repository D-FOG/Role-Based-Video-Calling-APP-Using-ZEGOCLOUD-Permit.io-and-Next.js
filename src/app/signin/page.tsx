'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ToastContainer, useToast } from "@/components/ui/toast"

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { addToast } = useToast()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    
    console.log(result)

    if (!result || typeof result !== "object") {
      setErrorMessage("Login failed unexpectedly.");
      addToast({
        title: "Login Failed",
        description: "Unexpected error occurred.",
        variant: "destructive",
      });
      return;
    }

    if (result?.error || !result.ok) {
      setErrorMessage(result?.error || "Invalid credentials")
       addToast({
        title: "Login Failed",
        description: "Login failed unexpectedly.",
        variant: "destructive",
      })
      console.log(result)
    } else {
      addToast({
        title: "Welcome Back!",
        description: result?.error || "Redirecting to dashboard...",
        variant: "success",
      })
       // Fetch the session to get user details
       const session = await getSession()
       if (session?.user?.id) {
         // Store the user ID in localStorage
         localStorage.setItem("userId", session.user.id)
         console.log("User ID stored in localStorage:", session.user.id)
       }

      setTimeout(() => {
        router.push("/create");
      }, 2000); // or your desired protected route
    }
  }

  return (
    <ToastContainer>
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
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
    </ToastContainer>  )
}
