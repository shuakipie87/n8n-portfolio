import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists to prevent immediate crashes if env is missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeSentiment = async (text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral', analysis: string }> => {
  if (!ai) {
    return {
      sentiment: 'neutral',
      analysis: 'API Key not configured. Unable to perform AI analysis.',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following Reddit comment/post text regarding the brand "Sons" (a hair loss treatment brand). 
      Determine the sentiment (positive, negative, or neutral) and provide a very brief (1 sentence) summary of the user's intent or core complaint/praise.

      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ['positive', 'negative', 'neutral'],
              description: 'The overall sentiment of the text.',
            },
            analysis: {
              type: Type.STRING,
              description: 'A one-sentence summary of the intent.',
            },
          },
          required: ['sentiment', 'analysis'],
        },
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    
    return {
      sentiment: result.sentiment || 'neutral',
      analysis: result.analysis || 'Analysis failed.',
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      sentiment: 'neutral',
      analysis: 'Error connecting to AI service.',
    };
  }
};