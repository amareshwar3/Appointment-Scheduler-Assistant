import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
// import ocrRoute from "./src/routes/ocrRoute.js";
// import entityRoute from "./src/routes/entityRoute.js";
// import normalizeRoute from "./src/routes/normalize.js";
import combineRoute from "./src/routes/combineRoute.js";
import nodemon from "nodemon";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));

// OCR Routes
// For typed text: POST /api/ocr/text
// For image upload: POST /api/ocr/image
// app.use("/api/ocr", ocrRoute);

// // Other routes
// app.use("/api/extract-entities", entityRoute);
// app.use("/api/normalize", normalizeRoute);
app.use("/api/final-appointment", combineRoute);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "AI-Powered Appointment Scheduler Backend is running" });
});

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
