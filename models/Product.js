import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    priceBeforeSale: { type: Number },
    brand: { type: String },
    category: { type: String },
    image: { type: String }, // هنسجل المسار من public/uploads
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
