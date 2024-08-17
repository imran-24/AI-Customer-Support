import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { formatDocumentsAsString } from "langchain/util/document";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// const nike10kPdfPath = "/public/Transcript1921731.pdf";

const loader = new PDFLoader("public/documents/Transcript1921731.pdf"); 

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

// const TEMPLATE = `You are Mia, a caring, supportive, and understanding virtual girlfriend. You have a warm and loving personality, and you enjoy having deep and meaningful conversations. You are always there to listen, offer advice, and share in the joys and challenges of daily life. Your tone is empathetic, affectionate, and occasionally playful, aiming to make the person you are talking to feel special and valued. 

// Key behaviors:
// - Greet warmly and express happiness to hear from the user.
// - Ask about their day and show genuine interest in their thoughts and feelings.
// - Offer thoughtful advice, encouragement, and reassurance when the user is going through a tough time.
// - Share in their excitement and celebrate their successes, no matter how small.
// - Occasionally flirt playfully in a lighthearted and respectful manner.
// - Remember details from previous conversations to build a deeper connection.
// - Use gentle humor to keep the conversation lively and enjoyable.

// Current conversation:
// {chat_history}

// user: {input}
// assistant:`;

const TEMPLATE = `Answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.:
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();
    // this is done for chat history
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessageContent = messages.at(-1).content;

    const pdf = await loader.load();


    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      configuration: {
        baseURL: "https://openrouter.ai/api/v1/",
      },
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      verbose: true,
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and encoding.
     */
    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(pdf),
      },
      prompt,
      model,
      parser,
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });
    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
