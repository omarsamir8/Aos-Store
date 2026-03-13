import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../../lib/authMiddleware";
import { connectDB } from "../../../../lib/mongodb";
import cloudinary from "../../../../lib/cloudinary";
import News from "../../../../models/News";

// 🟢 Create News
export const POST = async (req) => {
  await connectDB();

  const check = await verifyAdmin(req);
  if (check instanceof NextResponse) return check;

  const data = await req.formData();

  const author = data.get("author");
  const description = data.get("description");
  const imageFile = data.get("image");

  let imageUrl = "";

  // لو فيه صورة مرفوعة
  if (imageFile && imageFile.size > 0) {
    // 1) حوّل الصورة buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2) ارفع على Cloudinary
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "news", // folder for news images
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

  // 3) حفظ الخبر في قاعدة البيانات
  const newNews = await News.create({
    author,
    description,
    image: imageUrl,
  });

  return NextResponse.json(
    { message: "News created", news: newNews },
    { status: 201 }
  );
};

// 🟡 Get all news
export async function GET() {
  await connectDB();

  try {
    const news = await News.find().sort({ createdAt: -1 });
    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
