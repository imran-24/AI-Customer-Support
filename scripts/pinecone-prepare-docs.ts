// This operation might fail because indexes likely need
// more time to init, so give some 5 mins after index
// require("dotenv").config();

import { getChunkedDocsFromPDF } from "@/app/lib/pdf-loader";
import { getPineconeClient } from "@/app/lib/pinecone-client";
import { embedAndStoreDocs } from "@/app/lib/vector-store";

// creation and try again.
(async () => {
  try {
    const pineconeClient = await getPineconeClient();
    console.log("Preparing chunks from PDF file");
    const docs = await getChunkedDocsFromPDF();
    console.log(`Loading ${docs.length} chunks into pinecone...`);
    await embedAndStoreDocs(pineconeClient, docs);
    console.log("Data embedded and stored in pine-cone index");
  } catch (error) {
    console.error("Init client script failed ", error);
  }
})();
