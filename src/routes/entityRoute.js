import express from "express";
import { extractEntities } from "../services/entityService.js";

const router = express.Router();

router.post("/", (req, res) => {

    const { raw_text } = req.body;
  if (!raw_text) return res.status(400).json({ status: "error", message: "raw_text missing" });
  const result = extractEntities(raw_text);
  return res.json(result);
});

export default router;
