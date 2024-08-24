import { IndexList, Pinecone as PineconeClient } from "@pinecone-database/pinecone";

let pineconeClientInstance: PineconeClient | null = null;

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create pineconeIndex if it doesn't exist
async function createIndex(client: PineconeClient, indexName: string) {
  try {
    await client.createIndex({
      name: indexName, // The name of the index (string)
      dimension: 768, // The dimension of the vectors (number)
      metric: "cosine", // The metric to use for similarity (string)
      spec: {
        serverless: {
          cloud: "aws", // Cloud provider (string)
          region: "us-east-1", // Region (string)
        },
      },
    });
    console.log(
      `Waiting for ${process.env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(Number(process.env.INDEX_INIT_TIMEOUT)!);
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pineconeClient = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY!
    });
    console.log("Pinecone instance created");
    
    const indexName = process.env.PINECONE_INDEX_NAME!;

    console.log(`Name of the index ${indexName}`);
    const existingIndexes: any = await pineconeClient.listIndexes();

    console.log(`There are ${existingIndexes.indexes.length} Pinecone indexes.`);

    if (!existingIndexes.indexes.includes(indexName)) {
      console.log("New index creating...");
      createIndex(pineconeClient, indexName);
    } else {
      console.log("Your index already exists. nice !!");
    }

    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
