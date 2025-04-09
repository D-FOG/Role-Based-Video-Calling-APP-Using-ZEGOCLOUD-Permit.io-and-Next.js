// // pages/api/meeting-token.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { createHmac } from 'crypto'

// const APP_ID = parseInt(process.env.ZEGO_APP_ID!) // from .env.local
// const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET! // from .env.local

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

//   const { userID } = req.body
//   if (!userID) return res.status(400).json({ message: 'Missing user ID' })

//   const effectiveTimeInSeconds = 3600
//   const currentTime = Math.floor(Date.now() / 1000)
//   const payloadObject = {
//     app_id: APP_ID,
//     user_id: userID,
//     nonce: Math.random() * 100000,
//     ctime: currentTime,
//     expire: effectiveTimeInSeconds,
//   }

//   const payload = Buffer.from(JSON.stringify(payloadObject)).toString('base64')
//   const hash = createHmac('sha256', SERVER_SECRET).update(payload).digest('hex')
//   const token = `${APP_ID}:${hash}:${payload}`

//   res.status(200).json({ token })
// }

// app/api/meeting-token/route.ts
// import { NextResponse } from 'next/server';
// import { createHmac } from 'crypto';

// const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!); // from .env.local
// const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!; // from .env.local

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { userID } = body;

//     if (!userID) {
//       return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
//     }

//     const effectiveTimeInSeconds = 3600;
//     const currentTime = Math.floor(Date.now() / 1000);
//     const payloadObject = {
//       app_id: APP_ID,
//       user_id: userID,
//       nonce: Math.floor(Math.random() * 1000000),
//       ctime: currentTime,
//       expire: effectiveTimeInSeconds,
//     };

//     const payload = Buffer.from(JSON.stringify(payloadObject)).toString('base64');
//     const hash = createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
//     const token = `${APP_ID}:${hash}:${payload}`;

//     return NextResponse.json({ token }, { status: 200 });
//   } catch (error) {
//     console.error('Error generating token:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
// import { NextResponse } from 'next/server'

// const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!)
// const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!

// console.log('APP_ID:', APP_ID)
// console.log('SERVER_SECRET:', SERVER_SECRET)

// export async function POST(request: Request) {
//   try {
//     const { userID, roomID } = await request.json()

//     console.log('userID:', userID, 'roomID:', roomID)

//     if (!userID || !roomID) {
//         return NextResponse.json({ message: 'Missing userID or roomID' }, { status: 400 })
//     }

//     const userName = `Guest_${userID}`

//     let token: string
//     try {
//     token = ZegoUIKitPrebuilt.generateKitTokenForTest(
//         APP_ID,
//         SERVER_SECRET,
//         roomID,
//         userID,
//         userName
//     )
//     } catch (error) {
//     console.error('Error generating token:', error)
//     return NextResponse.json({ message: 'Error generating token' }, { status: 500 })
//     }
//     // const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
//     //   APP_ID,
//     //   SERVER_SECRET,
//     //   roomID,
//     //   userID,
//     //   userName
//     // )

//     // console.log(`token: ${token}`)

//     return NextResponse.json({ token }, { status: 200 })
//   } catch (error) {
//     console.error('Error generating token:', error)
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
//   }
// }

// src/app/api/auth/meeting-token/route.ts
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
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

    // const effectiveTimeInSeconds = 3600; // token valid for 1 hour
    // const currentTime = Math.floor(Date.now() / 1000);
    // const nonce = Math.floor(Math.random() * 1000000);
    const userName = `Guest_${userID}`; // Generate a user name based on userID

    const kitTokenTest = generateToken(APP_ID, userID, SERVER_SECRET,roomID, userName, 3600);
    // Construct the payload as required by ZEGOCLOUD
    // const payloadObject = {
    //   app_id: APP_ID,
    //   user_id: userID,
    //   room_id: roomID,  // include room_id if needed by the token spec
    //   nonce,
    //   ctime: currentTime,
    //   expire: effectiveTimeInSeconds,
    // };

    //const payload = Buffer.from(JSON.stringify(payloadObject)).toString('base64');
    //const hash = createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
    //const token = `${APP_ID}:${hash}:${payload}`;

    //console.log(`Generated token: ${token}`);
    return NextResponse.json({ token: kitTokenTest }, { status: 200 });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


