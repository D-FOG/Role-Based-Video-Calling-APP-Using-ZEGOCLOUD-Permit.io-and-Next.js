import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongooseConnection";
import Meeting from "@/models/meeting";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permit } from "@/lib/permit";

export async function POST(request: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    // Parse JSON body
    const body = await request.json();
    const {
      title,
      location,
      emailNotification = "off",
      reminderTime,
      description = "",
      guestEmails = [],
      guestPermissions = [],
      userId,
    } = body;

    // Validate required fields (adjust validation as needed)
    if (
      !title ||
      !location ||
      !reminderTime ||
      !reminderTime.value ||
      !reminderTime.unit
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
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

    // create a resource instance for the meeting and assign it to the user with the role 'host'
    if (!userId) {
      return NextResponse.json(
        { message: "User Id not present" },
        { status: 401 }
      );
    }

    await permit.api.resourceInstances.create({
      key: userId,
      resource: "zeego-clone",
      tenant: "default",
    });

    //  assign user to the resource instance
    await permit.api.roleAssignments.assign({
      user: userId, // User key
      role: `host`, // Role key
      tenant: "default",
      resource_instance: `zeego-clone:${userId}`, // Use the correct resource instance key
    });


    return NextResponse.json(
      {
        message: "Meeting created successfully",
        meetingId: meeting._id,
        roomId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
