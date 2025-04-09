import Link from "next/link"
import { Calendar, ChevronLeft, Home } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-gradient-to-b from-white to-[#f0f5ff] px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Calendar className="h-32 w-32 text-[#4285F4]" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-[#4285F4] pt-5">404</span>
            </div>
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#4285F4] sm:text-4xl">Page not found</h1>

        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn&rsquo;tt find the meeting page you&rsquo;tre looking for. It might have been moved, deleted, or never
          existed.
        </p>

        <div className="flex flex-col justify-between space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Button asChild className="bg-[#4285F4] hover:bg-[#3b78de]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4] hover:text-white"
          >
            <Link href="/meetings">
              <ChevronLeft className="mr-2 h-4 w-4" />
              View Meetings
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/#" className="font-medium text-[#4285F4] hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

