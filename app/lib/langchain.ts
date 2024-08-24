import { getVectorStore } from "./vector-store";

import { contextualizeQPrompt, qaPrompt } from "./prompt-templates";
import { streamingModel, nonStreamingModel } from "./llm";
import { Pinecone } from "@pinecone-database/pinecone";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { BaseMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

type callChainArgs = {
  question: string;
  chatHistory: (HumanMessage | SystemMessage)[];
};

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createStreamDataTransformer } from "ai";

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    // Open AI recommendation
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const vectorStore = await getVectorStore(client);
    const retriever = vectorStore.asRetriever();

    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm: nonStreamingModel,
      retriever,
      rephrasePrompt: contextualizeQPrompt,
    });

    // Below we use createStuffDocuments_chain to feed all retrieved context
    // into the LLM. Note that we can also use StuffDocumentsChain and other
    // instances of BaseCombineDocumentsChain.
    const questionAnswerChain = await createStuffDocumentsChain({
      llm: streamingModel,
      prompt: qaPrompt,
    });

    const ragChain = await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: questionAnswerChain,
    });

    // console.log(typeof chatHistory);
    // Usage:
    const chat_history: BaseMessage[] = [];

    // console.log(chat_history);

    const response = await ragChain.stream({
      chat_history: chat_history,
      input: question,
    });

    if (!response) {
      throw new Error("RAG Chain did not return a valid response stream.");
    }


    // for await (const chunk of response) {
    //   const textChunk = chunk.answer;
    //   console.log("In the loop :",textChunk);
    //   console.log("In the loop :",chunk);
    // }


    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const textChunk = chunk.answer;
          // const textChunk = response.answer;
            console.log("LOOP :", textChunk, chunk);
            controller.enqueue(new TextEncoder().encode(textChunk));
          }
        } catch (err) {
          console.error("Error while reading from response stream:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return stream;
  } catch (e) {
    console.error(e);
    throw new Error("Call chain method failed to execute successfully!!");
  }
}
