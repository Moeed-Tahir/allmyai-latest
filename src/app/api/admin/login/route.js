import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }


    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@allmyai.ai";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "allmyai123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          message: "Login successful",
          isAdmin: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
