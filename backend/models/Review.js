import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String
});

export default mongoose.model("Review", reviewSchema);
