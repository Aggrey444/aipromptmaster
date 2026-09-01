import { jsonResponse, errorResponse, parseBody, LambdaEvent } from "./_shared";

export default async function handler(event: LambdaEvent) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return errorResponse(
        400,
        "GEMINI_API_KEY is not configured on the server. You can still manually edit and build prompts!"
      );
    }

    const { prompt, framework } = parseBody(event);
    if (!prompt) {
      return errorResponse(400, "Prompt text is required.");
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `You are an expert AI Prompt Engineer specializing in the ${framework || "CLEAR/SAEALD/SCENE"} framework. 
Enhance and refine the following user-generated prompt to make it even clearer, more precise, and highly effective for AI models, while strictly preserving all facts, requirements, negative constraints, and core intent.
Output ONLY the enhanced prompt text directly without conversational filler.

User Prompt:
${prompt}`,
      ],
    });

    const enhancedText = response.text?.trim() || prompt;
    return jsonResponse(200, { enhancedPrompt: enhancedText });
  } catch (err: any) {
    console.error("Error in ai-enhance:", err);
    return errorResponse(500, err.message || "Failed to enhance prompt with AI.");
  }
}