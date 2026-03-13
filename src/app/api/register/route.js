export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword, role} = await req.json();
    await connectDB();

    // check required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // check passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role} },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
    