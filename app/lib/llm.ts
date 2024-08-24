import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

// export const streamingModel = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: "gemini-pro",
//   streaming: true,
// //   verbose: true,
//   temperature: 0, 
// });

export const streamingModel = new ChatOpenAI({
  configuration: {
    baseURL: "https://openrouter.ai/api/v1/",
  },
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  model: "gpt-3.5-turbo",
  temperature: 0.8,
  // verbose: true,
  streaming: true
});

export const nonStreamingModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-pro",
//   verbose: true,
  temperature: 0,
});
