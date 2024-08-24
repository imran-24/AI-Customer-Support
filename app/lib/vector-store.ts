import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function embedAndStoreDocs(
  client: Pinecone,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  const index = client.Index(process.env.PINECONE_INDEX_NAME!);

  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // // Get the generative model
  // const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  // /*create and store the embeddings in the vectorStore*/

  // docs.forEach(async (doc) => {
  //   try {
  //     // Generate the embedding for the text
  //     const result = await model.embedContent(doc.pageContent);
  //     const embedding = result.embedding;

  //     // Upsert the embedding into Pinecone
  //     await index.upsert([
  //       {
  //         id: uuidv4(), // Generate a unique ID
  //         values: embedding.values, // This should be an array
  //         metadata: {
  //           text: doc.pageContent,
  //         },
  //       },
  //     ]);

  //     // console.log("Embedding stored successfully:", upsertResponse);
  //   } catch (error) {
  //     console.log("error ", error);
  //     throw new Error("Failed to load your docs !");
  //   }
  // });

  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey: process.env.GEMINI_API_KEY,
    });

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const index = client.Index(process.env.PINECONE_INDEX_NAME!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
