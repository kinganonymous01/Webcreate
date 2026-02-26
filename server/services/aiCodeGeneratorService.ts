import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateFileCode(filePrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: filePrompt,
    config: {
      temperature: 0.2,
    },
  });

  const rawCode = response.text || "";
  const cleaned = rawCode
    .trim()
    .replace(/^```[a-z]*\n?/, "")
    .replace(/```$/, "")
    .trim();

  if (!cleaned) throw new Error("AI returned empty code for file");

  return cleaned;
}
