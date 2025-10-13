import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { handleOCR } from "../services/ocrService.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only .png, .jpg, and .jpeg files are allowed"));
    }
    cb(null, true);
  },
});

/////////////////////
// TEXT ROUTE
/////////////////////
router.post("/text", async (req, res) => {
  try {
    const text = req.body.text?.trim();

    if (!text) return res.status(400).json({ error: "No text provided" });

    console.log("➡️ Processing typed text:", text);

    const result = await handleOCR({ text, imagePath: null });

    console.log("✅ OCR Result (text):", result);

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Text OCR Error:", err);
    return res.status(500).json({ error: "Failed to process text" });
  }
});

/////////////////////
// IMAGE ROUTE
/////////////////////
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = req.file.path;
    console.log("➡️ Processing uploaded image:", imagePath);

    const result = await handleOCR({ text: null, imagePath });

    console.log("✅ OCR Result (image):", result);

    // Delete uploaded image
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete image:", err.message);
      else console.log("🧹 Temporary image deleted:", imagePath);
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Image OCR Error:", err);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;
