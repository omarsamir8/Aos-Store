import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    guestInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // السعر وقت الطلب
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "paypal", "stripe"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true } // ينشئ createdAt و updatedAt تلقائيًا
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
