import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

// export const streamingModel = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: "gemini-pro",
//   streaming: true,
// //   verbose: true,
//   temperature: 0, 
// });

export const streamingModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-pro-latest",
  //   verbose: true,
  temperature: 0.4,
  streaming: true,
});

export const nonStreamingModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-pro-latest",
//   verbose: true,
  temperature: 0,
});
