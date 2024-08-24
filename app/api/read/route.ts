import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  indexName,
  queryPineconeVectorStoreAndQueryLLM,
} from "@/app/lib/utils";
import { createStreamDataTransformer, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // this is done for chat history
    //   const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const question = messages.at(-1).content;

    const stream = await queryPineconeVectorStoreAndQueryLLM(
      client,
      indexName,
      question
    );
    if (stream) {
      return new StreamingTextResponse(
        stream.pipeThrough(createStreamDataTransformer())
      );
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
