// import crypto from 'crypto';

// export function generateToken(appId:number, userId:string, serverSecret:string, roomId:string, userName:string, effectiveTimeInSeconds = 3600):string {
//   const payloadObject = {
//     appID: appId,
//     userID: userId,
//     roomID: roomId,
//     userName: userName,
//     privilege: {
//       1: 1, // login
//       2: 1, // publish
//     },
//     create_time: Math.floor(Date.now() / 1000),
//     expire_time: Math.floor(Date.now() / 1000) + effectiveTimeInSeconds,
//     nonce: Math.floor(Math.random() * 1000000),
//   };

//   const payloadString = JSON.stringify(payloadObject);
//   const base64Payload = Buffer.from(payloadString).toString('base64');

//   const hmac = crypto.createHmac('sha256', serverSecret);
//   hmac.update(base64Payload);
//   const hash = hmac.digest();

//   const version = '04';
//   const base64Hash = hash.toString('base64');

//   const token = `${version}${Buffer.from(base64Hash).toString()}#${base64Payload}`;
//   return token;
// }


// import crypto from 'crypto';

// export function generateToken(appId:number, userId:string, serverSecret:string, roomId:string, userName:string, effectiveTimeInSeconds = 3600):string {
//   const payloadObject = {
//     appID: appId,
//     userID: userId,
//     roomID: roomId,
//     userName: userName,
//     // privilege: {
//     //   1: 1, // login
//     //   2: 1, // publish
//     // },
//     // create_time: Math.floor(Date.now() / 1000),
//     // expire_time: Math.floor(Date.now() / 1000) + effectiveTimeInSeconds,
//     // nonce: Math.floor(Math.random() * 1000000),
//   };

//   // Convert payload object to a string and then encode it as base64
//   const payloadString = JSON.stringify(payloadObject);
//   const base64Payload = Buffer.from(payloadString).toString('base64');

//   // Create the HMAC hash
//   const hmac = crypto.createHmac('sha256', serverSecret);
//   hmac.update(base64Payload);
//   const hash = hmac.digest();

//   // Base64 encode the hash
//   const base64Hash = hash.toString('base64');

//   // Version of the token (04 is the latest)
//   const version = '04';

//   // Combine version, hash, and payload to generate the token
//   const token = `${version}${base64Hash}#${base64Payload}`;

//   return token;
// }

// import crypto from 'crypto';

// export function generateToken(
//   appId: number,
//   userId: string,
//   serverSecret: string,
//   roomId: string,
//   userName: string,
//   expire = 3600
// ): string {
//   const now = Math.floor(Date.now() / 1000);
//   const nonce = Math.floor(Math.random() * 1000000);
//   const payloadObject = {
//     appID: appId,
//     userID: userId,
//     roomID: roomId,
//     userName: userName,
//     privilege: {
//       1: 1, // login
//       2: 1, // publish stream
//     },
//     create_time: now,
//     expire_time: now + expire,
//     nonce,
//   };

//   const payloadString = JSON.stringify(payloadObject);
//   const base64Payload = Buffer.from(payloadString).toString('base64');
//   const hmac = crypto.createHmac('sha256', serverSecret);
//   hmac.update(base64Payload);
//   const hash = hmac.digest('base64');
//   const version = '04';

//   return `${version}${hash}#${base64Payload}`;
// }

//import { GenerateToken04, PrivilegeKeyLogin, PrivilegeKeyPublish } from 'zego_server_assistant/token/node';
import { generateToken04 } from '@/app/utils/zegoAssistant';

export function generateZegoToken({
  appID,
  serverSecret,
  roomID,
  userID,
  expire = 3600,
}: {
  appID: number;
  serverSecret: string;
  roomID: string;
  userID: string;
  expire?: number;
}) {
  const payload = {
    room_id: roomID,
    // privilege: {
    //   [PrivilegeKeyLogin]: 1,
    //   [PrivilegeKeyPublish]: 1,
    // },
    stream_id_list: null,
  };

  return generateToken04(appID, serverSecret, userID, expire, JSON.stringify(payload));
}
