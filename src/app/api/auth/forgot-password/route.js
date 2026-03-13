export const runtime = "nodejs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // أو smtp بتاعك
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ResetPassword/${resetToken}`;

    const mailOptions = {
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Reset link sent to email" }, { status: 200 });
  } catch (error) {
    console.error("❌ Forgot Password error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
