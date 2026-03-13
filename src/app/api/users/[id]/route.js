export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";


// 🟢 Update User
export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ لازم await
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}



// 🔴 Delete User
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ نفس التعديل هنا

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}