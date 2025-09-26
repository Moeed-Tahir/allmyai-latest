import connectDB from "@/lib/mongodb";
import Email from "@/models/Email";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// --- Resend Configuration ---
const createResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Send email using Resend
const sendEmail = async (emailOptions) => {
  try {
    // console.log("🚀 Attempting to send email via Resend...");
    const resend = createResendClient();

    const { data, error } = await resend.emails.send({
      from: emailOptions.from || 'AllMyAI <noreply@allmyai.ai>',
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      text: emailOptions.text,
    });

    if (error) {
      throw error;
    }

    // console.log("✅ Email sent successfully via Resend:", data.id);
    return { success: true, provider: 'resend', id: data.id };
  } catch (error) {
    console.error("❌ Resend failed:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send welcome email to user
const sendWelcomeEmail = async (userEmail) => {
  const emailOptions = {
    from: 'AllMyAI <noreply@allmyai.ai>',
    to: userEmail,
    subject: "Welcome to Our Waitlist! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Waitlist</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef; }
          .welcome-text { font-size: 18px; margin-bottom: 20px; }
          .highlight { background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're In!</h1>
            <p>Welcome to our exclusive waitlist</p>
          </div>
          <div class="content">
            <div class="welcome-text">
              <p>Hi there!</p>
              <p>Thank you for joining our waitlist! We're thrilled to have you on board.</p>
            </div>
            
            <div class="highlight">
              <h3>What happens next?</h3>
              <p>✨ You'll be among the first to know when we launch<br>
              🎁 Get exclusive early access and special offers<br>
              📧 Receive important updates directly in your inbox</p>
            </div>
            
            <p>We're working hard to bring you something amazing, and we can't wait to share it with you soon!</p>
            
            <p>Stay tuned for updates!</p>
            
            <p>Best regards,<br><strong>The AllMyAI Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>&copy; 2024 AllMyAI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Our Waitlist!
      
      Hi there!
      
      Thank you for joining our waitlist! We're thrilled to have you on board.
      
      What happens next?
      - You'll be among the first to know when we launch
      - Get exclusive early access and special offers  
      - Receive important updates directly in your inbox
      
      We're working hard to bring you something amazing, and we can't wait to share it with you soon!
      
      Stay tuned for updates!
      
      Best regards,
      The AllMyAI Team
    `
  };

  const result = await sendEmail(emailOptions);
  return result.success;
};

// Send notification email to admin
const sendNotificationEmail = async (userEmail, totalCount) => {
  const adminEmail = process.env.NOTIFICATION_EMAIL || 'abdullah.k10204@gmail.com';

  const emailOptions = {
    from: 'AllMyAI <noreply@allmyai.ai>',
    to: adminEmail,
    subject: `🔔 New Waitlist Signup - ${userEmail}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin-top: 10px; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }
          .stats { background: #e7f3ff; padding: 15px; border-radius: 6px; text-align: center; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 New Waitlist Signup!</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>📧 New Subscriber Details</h3>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>IP:</strong> ${process.env.NODE_ENV === 'development' ? 'localhost' : 'N/A'}</p>
            </div>
            
            <div class="stats">
              <h3>📊 Current Statistics</h3>
              <p><strong>Total Waitlist Subscribers:</strong> ${totalCount}</p>
            </div>
            
            <p><small>This is an automated notification from your waitlist system.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Waitlist Signup!
      
      Email: ${userEmail}
      Date: ${new Date().toLocaleString()}
      Total Subscribers: ${totalCount}
      
      This is an automated notification from your waitlist system.
    `
  };

  const result = await sendEmail(emailOptions);
  return result.success;
};

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if email already exists
    const existingEmail = await Email.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Save email to database
    const newEmail = new Email({
      email: email.toLowerCase(),
      subscribedAt: new Date()
    });
    await newEmail.save();

    // Get total count for admin notification
    const totalCount = await Email.countDocuments();

    // Send emails (don't fail the request if emails fail)
    const emailResults = await Promise.allSettled([
      sendWelcomeEmail(email),
      sendNotificationEmail(email, totalCount)
    ]);

    // Log email results
    // emailResults.forEach((result, index) => {
    //   const emailType = index === 0 ? 'welcome' : 'notification';
    //   if (result.status === 'fulfilled' && result.value) {
    //     console.log(`✅ ${emailType} email sent successfully`);
    //   } else {
    //     console.error(`❌ ${emailType} email failed:`, result.reason);
    //   }
    // });

    return NextResponse.json(
      {
        message: "Email saved successfully and notifications sent",
        data: {
          email: newEmail.email,
          subscribedAt: newEmail.subscribedAt,
          totalSubscribers: totalCount
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error in POST handler:", error);

    // Handle specific error types
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
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

    const emails = await Email.find({})
      .sort({ createdAt: -1 })
      .select('email createdAt subscribedAt');

    return NextResponse.json(
      {
        message: "Emails retrieved successfully",
        data: emails,
        count: emails.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}