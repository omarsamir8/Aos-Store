// app/api/auth/reset-password/[token]/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function POST(req, context) {
  try {
    await connectDB();

    // ⚡️ في App Router، params ممكن يكون Promise
    const resolvedParams = await context.params;
    const { token } = resolvedParams;

    // جلب كلمة السر الجديدة من body
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم بالتوكن والتأكد إن التوكن صالح
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // تشفير الباسورد الجديد
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Reset Password error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
