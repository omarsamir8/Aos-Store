import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../../lib/authMiddleware";
import { connectDB } from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import cloudinary from "../../../../lib/cloudinary";

// 🟢 Create product
export const POST = async (req) => {
  await connectDB();

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  const data = await req.formData();

  const name = data.get("name");
  const description = data.get("description");
  const price = Number(data.get("price"));
  const priceBeforeSale = data.get("priceBeforeSale")
    ? Number(data.get("priceBeforeSale"))
    : undefined;
  const brand = data.get("brand");
  const category = data.get("category");

  const imageFile = data.get("image");

  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    // Convert image → buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products", // dynamic folder path
          },
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        )
        .end(buffer);
    });

    imageUrl = upload.secure_url;
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    priceBeforeSale,
    brand,
    category,
    image: imageUrl,
  });

  return NextResponse.json(
    { message: "Product created", product: newProduct },
    { status: 201 }
  );
};

// 🟡 Get all products
export async function GET() {
  await connectDB();
  try {
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
