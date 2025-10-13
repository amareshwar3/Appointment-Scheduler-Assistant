import express from "express";
import { normalizeText } from "../services/normalizeService.js";

const router = express.Router();

/**
 * POST /normalize
 * Example input:
 * {
 *   "raw_text": "Book dentist next Friday at 3pm"
 * }
 */
router.post("/", (req, res) => {
  const { raw_text } = req.body;
 console.log("➡️ Normalizing text:", raw_text);
  if (!raw_text) {
    return res.status(400).json({ status: "error", message: "raw_text missing" });
  }

  const result = normalizeText(raw_text);
  return res.json(result);
});

export default router;
