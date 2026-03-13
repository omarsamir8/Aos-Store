// app/api/login/route.js
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 1- check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 2- check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3- generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET, // مهم يكون موجود في .env
      { expiresIn: "7d" }
    );

    // 4- return user data + token
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          allowedToSeeVideos: user.allowedToSeeVideos,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
