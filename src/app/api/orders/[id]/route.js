export const runtime = "nodejs"; 
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";
;

// GET order by id
export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params; // فك الـ Promise
    const { id } = params;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching order", error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE order
export async function PUT(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const body = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating order", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE order
export async function DELETE(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting order", error: error.message },
      { status: 500 }
    );
  }
}
