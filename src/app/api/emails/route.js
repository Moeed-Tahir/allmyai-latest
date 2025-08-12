import connectDB from "@/lib/mongodb";
import Email from "@/models/Email";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }


    const newEmail = new Email({ email });
    await newEmail.save();

    return NextResponse.json(
      {
        message: "Email saved successfully",
        data: { email: newEmail.email, createdAt: newEmail.createdAt },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving email:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const emails = await Email.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Emails retrieved successfully",
        data: emails,
        count: emails.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
