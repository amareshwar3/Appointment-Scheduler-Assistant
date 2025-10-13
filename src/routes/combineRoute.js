import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { handleOCR } from "../services/ocrService.js";
import { extractEntities } from "../services/entityService.js";
import { normalizeText } from "../services/normalizeService.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Combined endpoint
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const textInput = req.body.text?.trim();
    const imagePath = req.file?.path;

    if (!textInput && !imagePath)
      return res.status(400).json({ status: "error", message: "Provide text or image" });

    // Step 1: OCR
    const ocrResult = await handleOCR({ text: textInput || null, imagePath });
    if (!ocrResult.raw_text)
      return res.status(400).json({ status: "needs_clarification", message: "raw_text missing" });

    const raw_text = ocrResult.raw_text;
    console.log("➡️ Raw text for entity extraction & normalization:", raw_text);

    // Step 2: Entities
    const entities = extractEntities(raw_text);

    // Step 3: Normalize
    const normalized = normalizeText(raw_text);
    if (!normalized.normalized)
      return res.json({ status: "needs_clarification", message: "Ambiguous date/time or department" });

    // Step 4: Final JSON
    const appointment = {
      department: normalized.normalized.department || entities.entities.department,
      date: normalized.normalized.date,
      time: normalized.normalized.time,
      tz: normalized.normalized.tz,
    };



    if (imagePath) fs.unlink(imagePath, () => {});

    return res.json({
    appointment,
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Failed to process request" });
  }
});

export default router;
