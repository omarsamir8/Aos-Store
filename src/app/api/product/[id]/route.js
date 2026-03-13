import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Product from "../../../../../models/Product";
import { verifyAdmin } from "../../../../../lib/authMiddleware";
import cloudinary from "../../../../../lib/cloudinary";


// 🟡 GET single product
export async function GET(req, context) {
  await connectDB();
  
  const { id } = await context.params;

  try {
    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🟢 Update product (with optional Cloudinary image upload)
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  try {
    const contentType = req.headers.get("content-type");

    // لو الفورم فيها صورة (multipart/form-data)
    if (contentType.includes("multipart/form-data")) {
      const data = await req.formData();

      const name = data.get("name");
      const description = data.get("description");
      const price = data.get("price");
      const priceBeforeSale = data.get("priceBeforeSale");
      const brand = data.get("brand");
      const category = data.get("category");
      const imageFile = data.get("image");

      // هات المنتج القديم
      const oldProduct = await Product.findById(id);
      if (!oldProduct)
        return NextResponse.json({ message: "Product not found" }, { status: 404 });

      let imageUrl = oldProduct.image;

      // لو فيه صورة جديدة مرفوعة
      if (imageFile && imageFile.size > 0) {
        // 1) امسح الصورة القديمة من Cloudinary
        if (oldProduct.image) {
          const publicId = oldProduct.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy("products/" + publicId);
        }

        // 2) ارفع الجديدة
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const upload = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          ).end(buffer);
        });

        imageUrl = upload.secure_url;
      }

      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          priceBeforeSale,
          brand,
          category,
          image: imageUrl,
        },
        { new: true }
      );

      return NextResponse.json({
        message: "Updated successfully",
        product: updated,
      });
    }

    // لو JSON بدون صورة
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updated)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json({
      message: "Updated successfully",
      product: updated,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// 🔴 DELETE product + delete image from Cloudinary
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  try {
    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    // Delete image from Cloudinary
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy("products/" + publicId);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
