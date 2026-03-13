import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { verifyAdmin } from "../../../../../lib/authMiddleware";
import cloudinary from "../../../../../lib/cloudinary";
import News from "../../../../../models/News";

// 🟢 Update News (PUT)
export async function PUT(req, context) {
  await connectDB();
  const { id: newsId } = await context.params;

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  const contentType = req.headers.get("content-type");

  // لو الفورم فيها صورة (multipart/form-data)
  if (contentType.includes("multipart/form-data")) {
    const data = await req.formData();
    const author = data.get("author");
    const description = data.get("description");
    const imageFile = data.get("image");

    // هات الخبر القديم
    const oldNews = await News.findById(newsId);
    if (!oldNews)
      return NextResponse.json({ message: "News not found" }, { status: 404 });

    let imageUrl = oldNews.image;

    // لو فيه صورة جديدة
    if (imageFile && imageFile.size > 0) {
      // 1) احذف القديمة من Cloudinary
      if (oldNews.image) {
        const publicId = oldNews.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy("news/" + publicId);
      }

      // 2) ارفع الجديدة
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "news" },
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = upload.secure_url;
    }

    const updated = await News.findByIdAndUpdate(
      newsId,
      { author, description, image: imageUrl },
      { new: true }
    );

    return NextResponse.json({
      message: "Updated successfully",
      news: updated,
    });
  }

  // لو JSON بدون صورة
  const body = await req.json();
  const updated = await News.findByIdAndUpdate(newsId, body, { new: true });

  if (!updated)
    return NextResponse.json({ message: "News not found" }, { status: 404 });

  return NextResponse.json({
    message: "Updated successfully",
    news: updated,
  });
}

// 🟢 Delete News (DELETE)
export async function DELETE(req, context) {
  await connectDB();
  const { id: newsId } = await context.params;

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  const news = await News.findById(newsId);
  if (!news)
    return NextResponse.json({ message: "News not found" }, { status: 404 });

  // حذف الصورة من Cloudinary
  if (news.image) {
    const publicId = news.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy("news/" + publicId);
  }

  await News.findByIdAndDelete(newsId);

  return NextResponse.json({ message: "Deleted successfully" });
}

// 🟢 Get News by ID (GET)
export async function GET(req, context) {
  await connectDB();
  const { id: newsId } = await context.params;

  const news = await News.findById(newsId);
  if (!news)
    return NextResponse.json({ message: "News not found" }, { status: 404 });

  return NextResponse.json({ news });
}
