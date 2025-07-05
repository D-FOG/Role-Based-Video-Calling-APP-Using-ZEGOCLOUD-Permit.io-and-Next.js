import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongooseConnection";
import Meeting from "@/models/meeting";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { permit } from "@/lib/permit";

type HttpError = {
  response?: {
    status?: number
  }
}

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
    console.log("Meeting created:", meeting);

    // create a resource instance for the meeting and assign it to the user with the role 'host'
    if (!userId) {
      return NextResponse.json(
        { message: "User Id not present" },
        { status: 401 }
      );
    }

    await permit.api.resourceInstances.create({
      //key: userId,
      key: roomId,
      resource: `zego-one`, // Use the userId as part of the resource instance key
      //resource: "zeego-clone",
      tenant: "default",
    });

    //  assign user to the resource instance
    await permit.api.roleAssignments.assign({
      user: userId, // User key
      role: `host`, // Role key
      tenant: "default",
      //resource_instance: `zeego-clone:${userId}`, // Use the correct resource instance key
      resource_instance: `zego-one:${roomId}`, // Use the correct resource instance key
    });

    for (const email of guestEmails) {
      // Assume you have logic to check or collect speaker-intended emails
      const shouldBeSpeaker = guestPermissions.includes("invite others"); // or use another condition

      try {
        await permit.api.users.create({ key: email, email });
      } catch (err: unknown) {
        if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as HttpError ).response?.status !== 409
      ) {
        throw err;
      } // skip if user already exists
      }
      await permit.api.roleAssignments.assign({
        user: email, // make sure this matches your user identification method
        role: shouldBeSpeaker ? "speaker" : "listener",
        tenant: "default",
        resource_instance: `zego-one:${roomId}`,
      });
    }


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
