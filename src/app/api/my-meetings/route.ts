import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { connectToDatabase } from '@/lib/mongooseConnection'
import Meeting from '@/models/meeting'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToDatabase()
  const meetings = await Meeting.find({ createdBy: session.user.id }).sort({ createdAt: -1 })

  if (meetings){
    return NextResponse.json(meetings)
  } else {
    return NextResponse.json({ error: 'No meetings found' }, { status: 404 })
  }
}
