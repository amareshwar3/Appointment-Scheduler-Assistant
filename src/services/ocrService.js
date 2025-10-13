import Tesseract from "tesseract.js";
import fs from "fs";
import Jimp from "jimp";

/**
 * Handles OCR for both text and image inputs.
 * - Returns processed text and confidence.
 * - Performs noise reduction and contrast adjustment for noisy/scanned images.
 */
export async function handleOCR({ text, imagePath }) {
  // If direct text is provided, trust it as high-confidence input
  if (text && text.trim().length > 0) {
    return { 
      source: "typed_text",
      raw_text: text.trim(),
      confidence: 0.98 
    };
  }

  // Ensure valid image input
  if (!imagePath) {
    return { status: "error", message: "No text or image provided" };
  }
  if (!fs.existsSync(imagePath)) {
    return { status: "error", message: "Uploaded file missing" };
  }

  try {
    // Step 1: Preprocess the image to improve OCR accuracy (denoise, grayscale, etc.)
    const image = await Jimp.read(imagePath);
    image
      .greyscale()          // convert to grayscale
      .contrast(0.4)        // enhance contrast
      .normalize()          // normalize brightness
      .resize(1000, Jimp.AUTO) // scale up small text regions
      .quality(100);        // max quality

    const processedPath = imagePath.replace(/(\.\w+)?$/, "_processed.jpg");
    await image.writeAsync(processedPath);

    // Step 2: Run OCR on the processed image
    const result = await Tesseract.recognize(processedPath, "eng", {
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{};:'\"\\|<>/`~ ",
    });

    // Step 3: Extract text and compute confidence
    const rawText = (result?.data?.text || "").trim();
    let conf = 0.85;
    if (result?.data?.confidence)
      conf = Math.min(0.99, result.data.confidence / 100);

    // Step 4: Classify input as "noisy_image" or "typed_image"
    const avgCharWidth = rawText.length > 0 ? rawText.length / (image.bitmap.width / 10) : 0;
    const inputType =
      avgCharWidth < 4 ? "noisy_image" : "typed_image";

    // Optional cleanup
    fs.unlink(processedPath, () => {});

    return {
      source: inputType,
      raw_text: rawText,
      confidence: parseFloat(conf.toFixed(2)),
    };
  } catch (e) {
    console.error("OCR Processing Error:", e);
    return { status: "error", message: e.message };
  }
}
