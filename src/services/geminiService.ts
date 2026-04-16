import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getExplanation(question: string, userAnswer: string, correctAnswer: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a friendly language tutor for ${language}. 
      The student was asked: "${question}".
      The correct answer is: "${correctAnswer}".
      The student answered: "${userAnswer}".
      
      Briefly explain the mistake and provide a helpful tip or grammatical rule in a friendly, encouraging way. 
      Keep it under 2 sentences.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Don't worry! Keep practicing and you'll get it next time.";
  }
}

export async function getLessonTip(lessonTitle: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a quick, helpful tip for a language lesson titled "${lessonTitle}" in ${language}. 
      Keep it short and actionable.`,
    });
    return response.text;
  } catch (error) {
    return "Focus on the pronunciation and common usage!";
  }
}
