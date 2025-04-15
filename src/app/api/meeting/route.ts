import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongooseConnection';
import Meeting from '@/models/meeting';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/lib/authOptions'

export async function POST(request: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }
    // Parse JSON body
    const body = await request.json();
    const {
      title,
      location,
      emailNotification = 'off',
      reminderTime,
      description = '',
      guestEmails = [],
      guestPermissions = [],
    } = body;

    // Validate required fields (adjust validation as needed)
    if (!title || !location || !reminderTime || !reminderTime.value || !reminderTime.unit) {
      return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const roomId = randomUUID();

    // Create a new meeting document
    const meeting = new Meeting({
      title,
      location,
      emailNotification,
      roomId,
      reminderTime,
      description,
      guestEmails,
      guestPermissions,
      createdBy: session.user.id,
    });

    await meeting.save();

    return NextResponse.json(
      { message: 'Meeting created successfully', meetingId: meeting._id, roomId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
