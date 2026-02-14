import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

/* ---------------- CREATE REVIEW ---------------- */
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET ALL REVIEWS ---------------- */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE REVIEW ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- ADMIN DELETE REVIEW ---------------- */

router.delete("/:id", async (req, res) => {
  try {
    const adminKey = req.headers["admin-key"];

    if (adminKey !== "ADMIN123") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;