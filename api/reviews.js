import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  return cached.conn;
}

const ReviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
});

const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const reviews = await Review.find().sort({ _id: -1 });
    return res.status(200).json(reviews);
  }

  if (req.method === "POST") {
    const review = await Review.create(req.body);
    return res.status(201).json(review);
  }

  res.status(405).json({ message: "Method not allowed" });
}
