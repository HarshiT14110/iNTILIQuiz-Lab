
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (topic: string, difficulty: string, count: number = 5): Promise<Quiz> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a comprehensive quiz about "${topic}" with a difficulty level of "${difficulty}". 
      CRITICAL: You MUST generate exactly ${count} questions. No more, no less.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING }
                      },
                      required: ["id", "text"]
                    }
                  },
                  correctOptionId: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctOptionId", "explanation"]
              }
            }
          },
          required: ["title", "description", "questions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("NEURAL_EMPTY_RESPONSE: The AI returned no content.");
    }

    const quiz = JSON.parse(response.text) as Quiz;
    
    if (!quiz.questions || quiz.questions.length === 0) {
      throw new Error("SCHEMA_MISMATCH: The generated data structure is invalid.");
    }

    if (quiz.questions.length > count) {
      quiz.questions = quiz.questions.slice(0, count);
    }
    
    return quiz;
  } catch (err: any) {
    if (err.message?.includes("SAFETY")) {
      throw new Error("PROTOCAL_VIOLATION: The requested topic triggered safety filters.");
    }
    if (err.message?.includes("429")) {
      throw new Error("QUOTA_EXCEEDED: Too many requests to the neural core. Please wait.");
    }
    throw new Error(err.message || "GENERATION_FAILED: Failed to synthesize quiz data.");
  }
};
