import { CalendarClock, MoreHorizontal, Plus, Users } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample meeting data - in a real app, this would come from a database
const meetings = [
  {
    id: 1,
    title: "Product Team Standup",
    description: "Daily standup to discuss progress and blockers",
    date: "2025-04-07T09:00:00",
    duration: 30,
    // location: "Conference Room A",
    attendees: [
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "AJ" },
      { name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32", initials: "SM" },
      { name: "David Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "DC" },
    ],
  },
  {
    id: 2,
    title: "Quarterly Planning",
    description: "Review Q2 goals and plan for Q3",
    date: "2025-04-08T13:00:00",
    duration: 120,
    // location: "Main Boardroom",
    attendees: [
      { name: "Emily Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "EW" },
      { name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
      { name: "Jessica Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "JT" },
      { name: "Robert Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "RS" },
    ],
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "Present new feature proposals to client",
    date: "2025-04-09T15:30:00",
    duration: 60,
    // location: "Virtual - Zoom",
    attendees: [
      { name: "Thomas Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "TW" },
      { name: "Olivia Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "OD" },
    ],
  },
  {
    id: 4,
    title: "Design Review",
    description: "Review latest UI designs for the mobile app",
    date: "2025-04-10T11:00:00",
    duration: 45,
    // location: "Design Lab",
    attendees: [
      { name: "Sophia Martinez", avatar: "/placeholder.svg?height=32&width=32", initials: "SM" },
      { name: "Noah Garcia", avatar: "/placeholder.svg?height=32&width=32", initials: "NG" },
      { name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "EW" },
    ],
  },
]

// Helper function to format date and time
function formatDateTime(dateString: string, duration: number) {
  const date = new Date(dateString)
  const endTime = new Date(date.getTime() + duration * 60000)

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const formattedStartTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const formattedEndTime = endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return {
    date: formattedDate,
    time: `${formattedStartTime} - ${formattedEndTime}`,
  }
}

export default function MeetingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4285F4]">Meetings</h1>
          <p className="text-muted-foreground">View and manage your scheduled meetings</p>
        </div>
    
          <Link href="/new-meet">
          
        <Button className="bg-[#4285F4] hover:bg-[#3b78de]">
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
          </Link>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#4285F4] data-[state=active]:text-white">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-[#4285F4] data-[state=active]:text-white">
            Past
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-[#4285F4] data-[state=active]:text-white">
            All Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => {
              const { date, time } = formatDateTime(meeting.date, meeting.duration)
              return (
                <Card key={meeting.id} className="overflow-hidden border-t-4 border-t-[#4285F4]">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="line-clamp-1">{meeting.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CalendarClock className="mr-2 h-4 w-4 text-[#4285F4]" />
                        <div>
                          <div className="font-medium">{date}</div>
                          <div className="text-sm text-muted-foreground">{time}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {/* <MapPin className="mr-2 h-4 w-4 text-[#4285F4]" /> */}
                        {/* <span className="text-sm">{meeting.location}</span> */}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-[#4285F4]" />
                        <span className="text-sm">{meeting.attendees.length} attendees</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 px-6 py-3">
                    <div className="flex -space-x-2">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback className="bg-[#4285F4] text-white">{attendee.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-[#4285F4] text-xs font-medium text-white">
                          +{meeting.attendees.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4] hover:text-white"
                      >
                        <Link href={`/meetings/${meeting.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No past meetings</h3>
            <p className="text-muted-foreground">Past meetings will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">All meetings view</h3>
            <p className="text-muted-foreground">This tab would show all meetings in a different format</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

