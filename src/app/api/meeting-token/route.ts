import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/zegoToken';


// Use server-side environment variables (without NEXT_PUBLIC_ to keep them secret)
const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

export async function POST(request: Request) {
  try {
    const { userID, roomID } = await request.json();

    if (!userID || !roomID) {
      return NextResponse.json({ message: 'Missing userID or roomID' }, { status: 400 });
    }

    const userName = `Guest_${userID}`; // Generate a user name based on userID

    const kitTokenTest = generateToken(APP_ID, userID, SERVER_SECRET,roomID, userName, 3600);
    
    //console.log(`Generated token: ${token}`);
    return NextResponse.json({ token: kitTokenTest }, { status: 200 });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


