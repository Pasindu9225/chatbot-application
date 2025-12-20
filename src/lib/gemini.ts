import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Model 1: Fast text generation for the chat
export const textModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

// Model 2: Dedicated image generation model
export const imageModel = genAI.getGenerativeModel({
    model: "imagen-3" // Ensure your API key has access to Imagen or use a similar model
});