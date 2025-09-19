import connectDB from "@/lib/mongodb";
import Email from "@/models/Email";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure your email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // or your email service (e.g., "outlook", "yahoo")
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASSWORD, // your email password or app password
    },
  });
};

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

    // Send notification email
    try {
      // Only send email if environment variables are set
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const transporter = createTransporter();

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER, // send to yourself
          subject: "New Waitlist Signup",
          html: `
            <h2>New Waitlist Subscription</h2>
            <p>A new email has been added to your waitlist:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <br>
            <p>Total waitlist subscribers: ${await Email.countDocuments()}</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Notification email sent successfully");
      } else {
        console.log("Email credentials not set, skipping notification");
      }
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the request if email sending fails
      // Just log the error and continue
    }

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