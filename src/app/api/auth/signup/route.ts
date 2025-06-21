import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongooseConnection";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { permit } from "@/lib/permit";


export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, firstName, lastName } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 422 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await user.save();

  const userId = user._id;

  // create user on Permit
  await permit.api.syncUser({
    key: userId,
    email: email,
    first_name: firstName,
    last_name: lastName,
    role_assignments: [
      {
        // assign the global viewer role to all users by default
        role: `viewer`,
        tenant: "default",
      },
    ],
  });

  return NextResponse.json({ message: "User created", userId }, { status: 201 });
}
