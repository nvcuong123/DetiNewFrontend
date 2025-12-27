
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketInsight = async (query: string, contextData: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemPrompt = `You are DETI AI, a specialized crypto market analyst for the DETI CEX platform. 
    Keep responses concise, professional, and data-driven. 
    Use the provided market context data to answer the user's question.
    Format your response in simple markdown.
    Avoid financial advice disclaimers in every single message, but be responsible.
    Current Market Context: ${contextData}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I couldn't generate an insight at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Analyzing market data... (Simulation: Connection to AI momentarily disrupted)";
  }
};
