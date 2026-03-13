export const runtime = "nodejs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET(req) {
  try {
    await connectDB();

    // 1- هات التوكن من الهيدر
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2- فك التوكن
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // 3- تحقق انه أدمن
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }

    // 4- رجّع كل اليوزرز
    const users = await User.find({});
    return NextResponse.json(
      { message: "All users fetched successfully", users },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get Users API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
