// import type { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongooseConnection";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   await connectToDatabase();

//   const existing = await User.findOne({ email });
//   if (existing) return res.status(422).json({ message: "User already exists" });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ email, password: hashedPassword });
//   await user.save();

//   res.status(201).json({ message: "User created" });
// }

// File: app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongooseConnection";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, firstName, lastName } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: "User already exists" }, { status: 422 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, firstName, lastName });
  await user.save();

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
