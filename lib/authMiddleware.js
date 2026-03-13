import { NextResponse } from "next/server";
import { connectDB } from "./mongodb";
import User from "../models/User";
import jwt from "jsonwebtoken";

export async function verifyAdmin(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return user;
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
