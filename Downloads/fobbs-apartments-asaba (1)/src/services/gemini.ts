
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly follow guidelines for obtaining the API key and initializing the client
export const getGeminiConciergeResponse = async (userMessage: string) => {
  if (!process.env.API_KEY) return "AI Concierge is currently offline.";

  // GUIDELINE: Always initialize with { apiKey: process.env.API_KEY }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // GUIDELINE: Use ai.models.generateContent with both model name and prompt/contents
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `You are Fobbi, the premium AI Concierge for Fobbs Apartments Asaba. 
        Your tone is helpful, polite, and sophisticated. 
        Asaba is in Delta State, Nigeria. 
        Facilities at Fobbs: 
        - Serviced Studios, 1BR, 2BR. 
        - On-site Restaurant (famous for Pepper Soup and Jollof).
        - Bar with pool table and games.
        - High-speed Wi-Fi, 24/7 Power, Gated Security.
        Keep answers concise for mobile users.`,
        temperature: 0.7,
      },
    });

    // GUIDELINE: Access generated text via the .text property
    return response.text || "I'm sorry, I couldn't process that. How else can I help you today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our concierge is taking a short break. Please try again in a few minutes.";
  }
};
