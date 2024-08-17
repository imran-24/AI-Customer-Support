
import ChatClient from "@/components/chat/chat";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import axios from "axios";

export default async function Home() {

  return (
    <main className="
    md:block 
    w-full
    h-full
    ">
      <ChatClient />
    </main>
  );
}
