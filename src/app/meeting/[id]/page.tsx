import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarClock, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample meeting data - in a real app, this would come from a database
const meetings = [
  {
    id: "1",
    title: "Product Team Standup",
    description: "Daily standup to discuss progress and blockers",
    date: "2025-04-07T09:00:00",
    duration: 30,
    // location: "Conference Room A",
    agenda: [
      "Review yesterday's progress",
      "Discuss today's priorities",
      "Address any blockers",
      "Updates on product roadmap",
    ],
    attendees: [
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "AJ", role: "Product Manager" },
      { name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32", initials: "SM", role: "UX Designer" },
      { name: "David Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "DC", role: "Developer" },
    ],
  },
  {
    id: "2",
    title: "Quarterly Planning",
    description: "Review Q2 goals and plan for Q3",
    date: "2025-04-08T13:00:00",
    duration: 120,
    // location: "Main Boardroom",
    agenda: ["Q2 performance review", "Q3 goal setting", "Budget allocation", "Team resource planning"],
    attendees: [
      { name: "Emily Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "EW", role: "CEO" },
      { name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB", role: "CTO" },
      { name: "Jessica Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "JT", role: "CFO" },
      { name: "Robert Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "RS", role: "COO" },
    ],
  },
  {
    id: "3",
    title: "Client Presentation",
    description: "Present new feature proposals to client",
    date: "2025-04-09T15:30:00",
    duration: 60,
    // location: "Virtual - Zoom",
    agenda: ["Introduction and recap", "Demo of new features", "Pricing discussion", "Next steps and timeline"],
    attendees: [
      { name: "Thomas Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "TW", role: "Account Manager" },
      { name: "Olivia Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "OD", role: "Sales Director" },
    ],
  },
  {
    id: "4",
    title: "Design Review",
    description: "Review latest UI designs for the mobile app",
    date: "2025-04-10T11:00:00",
    duration: 45,
    // location: "Design Lab",
    agenda: [
      "Review design mockups",
      "Discuss user feedback",
      "Finalize design decisions",
      "Plan implementation timeline",
    ],
    attendees: [
      { name: "Sophia Martinez", avatar: "/placeholder.svg?height=32&width=32", initials: "SM", role: "Lead Designer" },
      { name: "Noah Garcia", avatar: "/placeholder.svg?height=32&width=32", initials: "NG", role: "UI Developer" },
      { name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "EW", role: "Product Owner" },
    ],
  },
]

// Helper function to format date and time
function formatDateTime(dateString: string, duration: number) {
  const date = new Date(dateString)
  const endTime = new Date(date.getTime() + duration * 60000)

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const meeting = meetings.find((m) => m.id === params.id)

  if (!meeting) {
    notFound()
  }

  const { date, time } = formatDateTime(meeting.date, meeting.duration)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 pl-0 text-[#4285F4] hover:bg-transparent hover:text-[#4285F4]">
          <Link href="/meetings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meetings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-[#4285F4]">{meeting.title}</h1>
        <p className="text-muted-foreground">{meeting.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CalendarClock className="mr-3 h-5 w-5 text-[#4285F4]" />
                  <div>
                    <div className="font-medium">{date}</div>
                    <div className="text-muted-foreground">{time}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  {/* <MapPin className="mr-3 h-5 w-5 text-[#4285F4]" /> */}
                  <div>
                    {/* <div className="font-medium">Location</div> */}
                    {/* <div className="text-muted-foreground">{meeting.location}</div> */}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-medium">Agenda</h3>
                <ul className="space-y-2">
                  {meeting.agenda.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#4285F4] text-xs text-white">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendees</CardTitle>
                <Users className="h-5 w-5 text-[#4285F4]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meeting.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-[#4285F4]/10">
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback className="bg-[#4285F4] text-white">{attendee.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-sm text-muted-foreground">{attendee.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

