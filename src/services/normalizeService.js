import * as chrono from "chrono-node";
import moment from "moment-timezone";


export function normalizeText(raw_text) {
  const results = chrono.parse(raw_text, new Date(), { forwardDate: true });

  if (!results || results.length === 0) {
    return { status: "needs_clarification", message: "Cannot parse date/time from text" };
  }

  const parsed = results[0]; // take first match
  const parsedDate = parsed.start.date();

  // Base confidence
  let confidence = 0.7;

  // Increase confidence for exact numeric matches
  if (parsed.start.isCertain("hour") && parsed.start.isCertain("minute")) confidence += 0.1;
  if (parsed.start.isCertain("day") && parsed.start.isCertain("month")) confidence += 0.1;





  // IST conversion
  const ist = moment(parsedDate).tz("Asia/Kolkata");

  return {
    normalized: {
      date: ist.format("YYYY-MM-DD"),
      time: ist.format("HH:mm"),
      tz: "Asia/Kolkata",
    },
    normalization_confidence: parseFloat(confidence.toFixed(2)),
  };
}
