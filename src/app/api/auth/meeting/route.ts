// import type { NextApiRequest, NextApiResponse } from 'next';
// import { connectToDatabase } from '@/lib/mongooseConnection';
// import Meeting from '@/models/meeting';
// import { randomUUID } from 'crypto';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Only accept POST requests
//   if (req.method !== 'POST') {
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   try {
//     await connectToDatabase();

//     // Extract data from the request body
//     const {
//       title,
//       location,
//       emailNotification,
//       reminderTime, // expect something like { value: number, unit: string }
//       description,
//       guestEmails,
//       guestPermissions,
//     } = req.body;

//     // Validate required fields
//     if (!title || !location || !reminderTime) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }


//     const roomId = randomUUID();
//     // Create and save the meeting
//     const meeting = new Meeting({
//       title,
//       location,
//       emailNotification: emailNotification || 'off',
//       roomId,
//       reminderTime,
//       description,
//       guestEmails: guestEmails || [],
//       guestPermissions: guestPermissions || [],
//     });
//     await meeting.save();

//     res.status(201).json({ message: 'Meeting created successfully', meetingId: meeting._id });
//   } catch (error) {
//     console.error('Error creating meeting:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongooseConnection';
import Meeting from '@/models/meeting';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
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
