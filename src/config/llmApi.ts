import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite", 
  temperature: 0.3, 
  apiKey: process.env.GOOGLE_API_KEY || "",
//   timeout: 10000,
});
