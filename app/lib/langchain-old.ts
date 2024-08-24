import { ConversationalRetrievalQAChain } from "langchain/chains";
import { getVectorStore } from "./vector-store";
import { getPineconeClient } from "./pinecone-client";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import {
  STANDALONE_QUESTION_TEMPLATE,
  QA_TEMPLATE,
  contextualizeQPrompt,
  qaPrompt,
} from "./prompt-templates";
import { streamingModel, nonStreamingModel } from "./llm";
import { createStreamDataTransformer } from "ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { BaseMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

type callChainArgs = {
  question: string;
  chatHistory: {
    role: string;
    content: string;
  }[];
};

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    // Open AI recommendation
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    // const pineconeClient = client.Index(process.env.PINECONE_INDEX_NAME!);

    // const sanitizedQuestion = question.trim().replaceAll("\n", " ");

    const vectorStore = await getVectorStore(client);
    const retriever = vectorStore.asRetriever();

    // // const { stream, handlers } = LangChainStream({
    // //   experimental_streamData: true,
    // // });
    // const data = new experimental_StreamData();

    // // const vectorStore = await getVectorStore(pineconeClient);
    // // const { stream, handlers } = LangChainStream({
    // //   experimental_streamData: true,
    // // });
    // // const data = new experimental_StreamData();

    // // const chain = ConversationalRetrievalQAChain.fromLLM(
    // //   streamingModel,
    // //   vectorStore.asRetriever(),
    // //   {
    // //     qaTemplate: QA_TEMPLATE,
    // //     questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
    // //     returnSourceDocuments: true, //default 4
    // //     questionGeneratorChainOptions: {
    // //       llm: nonStreamingModel,
    // //     },
    // //   }
    // // );

    // // // Question using chat-history
    // // // Reference https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory
    // // chain
    // //   .call(
    // //     {
    // //       question: sanitizedQuestion,
    // //       chat_history: chatHistory,
    // //     },
    // //     [handlers]
    // //   )
    // //   .then(async (res) => {
    // //     const sourceDocuments = res?.sourceDocuments;
    // //     const firstTwoDocuments = sourceDocuments.slice(0, 2);
    // //     const pageContents = firstTwoDocuments.map(
    // //       ({ pageContent }: { pageContent: string }) => pageContent
    // //     );
    // //     console.log("already appended ", data);
    // //     data.append({
    // //       sources: pageContents,
    // //     });
    // //     data.close();
    // //   });

    // // // Return the readable stream
    // // return new StreamingTextResponse(stream, {}, data);

    // // const prompt1 = PromptTemplate.fromTemplate(STANDALONE_QUESTION_TEMPLATE);
    // // const prompt2 = PromptTemplate.fromTemplate(QA_TEMPLATE);

    // // // const parser = new HttpResponseOutputParser();

    // // const chain1 = prompt1
    // //   .pipe(NonStreaningModel)
    // //   .pipe(new StringOutputParser());

    // // // const chain2 = new RunnableLambda({
    // // //   func: async (input: any) => {
    // // //     const result = await chain1.invoke({
    // // //       chat_history: input.chat_history,
    // // //       question: input.question,
    // // //     });
    // // //     return {
    // // //       context: () => formatDocumentsAsString("dfsddf" as string),
    // // //       question: result,
    // // //     };
    // // //   },
    // // // })
    // // //   .pipe(prompt2)
    // // //   .pipe(streaningModel)
    // // //   .pipe(new StringOutputParser());

    // // const chain2 = RunnableSequence.from([
    // //   chain1,
    // //   (input) => ({
    // //     context: () => formatDocumentsAsString(""),
    // //     question: input,
    // //   }),
    // //   prompt2,
    // //   streaningModel,
    // //   new StringOutputParser(),
    // // ]);

    // // await chain2.invoke({
    // //   chat_history: chatHistory,
    // //   question: question,
    // // });

    // const chain = ConversationalRetrievalQAChain.fromLLM(
    //   streamingModel,
    //   vectorStore.asRetriever(),
    //   {
    //     qaTemplate: QA_TEMPLATE,
    //     questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
    //     returnSourceDocuments: true, //default 4
    //     questionGeneratorChainOptions: {
    //       llm: nonStreamingModel,
    //     },
    //   }
    // );

    // // Question using chat-history
    // // Reference https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory
    // const stream = await chain.stream(
    //   {
    //     question: sanitizedQuestion,
    //     chat_history: chatHistory,
    //   },
    // )
    // console.log(stream);
    // return new StreamingTextResponse(
    //   stream.pipeThrough(createStreamDataTransformer())
    // );

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
    const chat_history: BaseMessage[] = [
      ...chatHistory.map((chat) => {
        if (chat.role === "human") {
          return new HumanMessage({ content: chat.content });
        } else {
          return new SystemMessage({ content: chat.content });
        }
      }),
    ];

    console.log(chat_history);

    const response = await ragChain.stream({
      chat_history: chat_history,
      input: question,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const textChunk = chunk.answer;
          controller.enqueue(new TextEncoder().encode(textChunk));
        }
        controller.close();
      },
    });
    console.log(stream);

    return stream;
  } catch (e) {
    console.error(e);
    throw new Error("Call chain method failed to execute successfully!!");
  }
}
