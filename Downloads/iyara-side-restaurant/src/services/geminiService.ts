
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

export async function getMenuRecommendation(preference: string) {
  if (!API_KEY) {
    console.warn("Google GenAI API Key missing (VITE_GOOGLE_GENAI_API_KEY). Using fallback recommendation.");
    return "I recommend trying our Signature Jollof Rice Supreme—a customer favorite that never fails to delight.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `User preference: "${preference}". 
              Based on this, recommend a dish or combination from a menu that includes contemporary African (Jollof, Suya, Banga, Ofada) and Intercontinental (Steak, Salmon, Pasta, Pizza) dishes. 
              Keep the tone sophisticated and welcoming like a professional Maître d'. Be concise.`
            }
          ]
        }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I recommend trying our Signature Jollof Rice Supreme—a customer favorite that never fails to delight.";
  }
}
