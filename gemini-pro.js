// import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const askGemini = async(prompt) => {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

    // const prompt = 
    // "What are you"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // const text = response.text();
    return response;
    // console.log(text);
}

