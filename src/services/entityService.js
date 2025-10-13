export function extractEntities(rawText) {
  const txt = (rawText || "").toLowerCase();

  // Regex matches
  const deptMatch = txt.match(/\b(dentist|doctor|cardio|eye|orthopedic|derma)\b/);
  const timeMatch = txt.match(/\d{1,2}\s?(am|pm)/);
  const dateMatch = txt.match(/next\s+\w+|tomorrow|today|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/);

  // If any entity is missing
  if (!deptMatch || !timeMatch || !dateMatch)
    return { status: "needs_clarification", message: "Ambiguous date/time or department", entities_confidence: 0 };

  // Calculate confidence dynamically
  let confidence = 0;
  if (deptMatch) confidence += 0.4;  // department match is strong
  if (timeMatch) confidence += 0.3;  // time match is moderately strong
  if (dateMatch) confidence += 0.3;  // date match is moderately strong


  return {
    entities: {
      department: deptMatch[0],
      time_phrase: timeMatch[0],
      date_phrase: dateMatch[0]
    },
    entities_confidence: parseFloat(confidence.toFixed(2))
  };
}
