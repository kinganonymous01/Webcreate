import { GoogleGenAI } from "@google/genai";
import { structurePromptTemplate } from "../utils/promptTemplates.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function planProject(requirements: any) {
  const prompt = structurePromptTemplate(requirements);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const rawText = response.text || "";
  const cleaned = rawText
    .trim()
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  const plan = JSON.parse(cleaned);

  if (!plan.structure) throw new Error("AI returned invalid plan: missing structure");
  if (!Array.isArray(plan.structure.folders)) throw new Error("AI returned invalid plan: missing folders array");
  if (!Array.isArray(plan.files)) throw new Error("AI returned invalid plan: missing files array");
  if (plan.files.length === 0) throw new Error("AI returned empty files array");

  for (const file of plan.files) {
    if (!file.path) throw new Error("File entry missing path");
    if (!file.prompt) throw new Error("File entry missing prompt");
  }

  return plan;
}
