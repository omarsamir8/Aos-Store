export const runtime = "nodejs"; 
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newOrder = await Order.create(body);

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().populate("cartItems.product");

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
