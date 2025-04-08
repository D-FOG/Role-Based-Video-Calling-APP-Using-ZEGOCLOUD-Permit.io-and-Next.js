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
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const APP_ID = parseInt(process.env.ZEGO_APP_ID!); // from .env.local
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET!; // from .env.local

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userID } = body;

    if (!userID) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    const effectiveTimeInSeconds = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const payloadObject = {
      app_id: APP_ID,
      user_id: userID,
      nonce: Math.random() * 100000,
      ctime: currentTime,
      expire: effectiveTimeInSeconds,
    };

    const payload = Buffer.from(JSON.stringify(payloadObject)).toString('base64');
    const hash = createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
    const token = `${APP_ID}:${hash}:${payload}`;

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
