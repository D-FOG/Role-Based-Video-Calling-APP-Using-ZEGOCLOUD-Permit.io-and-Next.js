import { NextResponse } from 'next/server';
import { generateZegoToken } from '@/lib/zegoToken';


// Use server-side environment variables (without NEXT_PUBLIC_ to keep them secret)
const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
const SERVER_SECRET = process.env.NEXT_PUBLICZEGO_SERVER_SECRET!;

export async function POST(request: Request) {
  try {
    const { userID, roomID } = await request.json();

    if (!userID || !roomID) {
      return NextResponse.json({ message: 'Missing userID or roomID' }, { status: 400 });
    }

    const appID = APP_ID; // Use the app ID from environment variables
    const serverSecret = SERVER_SECRET; // Use the server secret from environment variables
    const userName = `Guest_${userID}`; // Generate a user name based on userID

    const kitTokenTest = generateZegoToken({ appID, serverSecret,roomID, userID });
    console.log(`Generated token for user ${userID} in room ${roomID}:`, kitTokenTest);
    
    //console.log(`Generated token: ${token}`);
    return NextResponse.json({ token: kitTokenTest }, { status: 200 });
  } catch (error) {
    console.error('Error generating token[From meeting-token]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


