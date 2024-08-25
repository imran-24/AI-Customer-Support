import { NextRequest, NextResponse } from "next/server";
import {
  createStreamDataTransformer,
  Message,
  StreamingTextResponse,
  streamText,
} from "ai";
import { callChain } from "@/app/lib/langchain";
import { HumanMessage } from "@langchain/core/messages";
import { AIMessage } from "@langchain/core/messages";

const formatMessage = (message: Message) =>
  message.role === "user"
    ? new HumanMessage(message.content)
    : new AIMessage(message.content);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages ?? [];
  //   console.log("Messages ", messages);
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const question = messages[messages.length - 1].content;

  if (!question) {
    return NextResponse.json("Error: No question in the request", {
      status: 400,
    });
  }

  try {
    const streamingResponse = await callChain({
      question,
      chatHistory: formattedPreviousMessages,
    });

    if (!streamingResponse) {
      return NextResponse.json("Error: No response from callChain", {
        status: 500,
      });
    }

    return new StreamingTextResponse(
      streamingResponse.pipeThrough(createStreamDataTransformer())
    );
  } catch (error) {
    console.error("Internal server error ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}
