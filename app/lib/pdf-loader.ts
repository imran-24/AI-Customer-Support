// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const pdfFile = "public/documents/Transcript1921731.pdf";
const csvFile = "public/documents/customers-100.csv";


export async function getChunkedDocsFromPDF() {
  try {
    const loader = new PDFLoader(pdfFile);
    const docs = await loader.load();

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);

    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
