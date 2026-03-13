import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    author:{type: String, required: true},
    description:{type: String, required: true},
    image: { type: String, default: "" },

  },
  { timestamps: true } // ينشئ createdAt و updatedAt تلقائيًا
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);