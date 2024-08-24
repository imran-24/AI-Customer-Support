import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
// import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  createPineconeIndex,
  indexName,
  updatePinecone,
} from "@/app/lib/utils";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";

export async function POST() {
  const loader = new DirectoryLoader("./public/documents", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs: Document[] = await loader.load();

  const vectorDimensions = 1536;
  // console.log(docs);
  const client = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });

  try {
    // Uncomment and await the createPineconeIndex if needed.
    // await createPineconeIndex(client, indexName, vectorDimensions);

    await updatePinecone(client, indexName, docs);

    return NextResponse.json({
      data: "Successfully created index and loaded data into Pinecone...",
    });
  } catch (err) {
    // console.error("Error: ", err);
    return NextResponse.json({
      error: "Failed to create index or load data into Pinecone.",
      details: err,
    });
  }
}
