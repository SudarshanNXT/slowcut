import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // API key from .env

export const askGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // use valid model
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
