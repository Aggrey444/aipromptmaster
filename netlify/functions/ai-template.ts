import { jsonResponse, errorResponse, parseBody, LambdaEvent } from "./_shared";

export default async function handler(event: LambdaEvent) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return errorResponse(
        400,
        "GEMINI_API_KEY is not configured. Built-in standard templates remain fully accessible."
      );
    }

    const { contentType, topic } = parseBody(event);
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `Generate a clean structural template outline for a "${contentType}" on the topic "${topic || "General"}".
Return valid JSON array of objects with the structure:
[
  { "id": "sec-1", "title": "Section Title", "placeholder": "Placeholder or instruction text for this section" },
  ...
]
Provide 5 to 8 logically structured sections. Return ONLY valid JSON with no markdown backticks.`,
      ],
    });

    let rawText = response.text?.trim() || "[]";
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const sections = JSON.parse(rawText);
    return jsonResponse(200, { sections });
  } catch (err: any) {
    console.error("Error in ai-template:", err);
    return errorResponse(500, err.message || "Failed to generate AI template.");
  }
}