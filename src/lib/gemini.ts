import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // We cast this to 'any' to stop the TypeScript error while keeping the feature
    generationConfig: {
        responseModalities: ["text", "image"],
    } as any
});