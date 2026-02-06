
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMenuRecommendation(preference: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User preference: "${preference}". 
      Based on this, recommend a dish or combination from a menu that includes contemporary African (Jollof, Suya, Banga, Ofada) and Intercontinental (Steak, Salmon, Pasta, Pizza) dishes. 
      Keep the tone sophisticated and welcoming like a professional Maître d'. Be concise.`
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I recommend trying our Signature Jollof Rice Supreme—a customer favorite that never fails to delight.";
  }
}
