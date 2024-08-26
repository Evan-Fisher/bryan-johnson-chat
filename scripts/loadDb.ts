import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import OpenAI from "openai";
import QDrant from "../clients/qdrant";

require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function loadDocuments() {
  const directoryLoader = new DirectoryLoader("data/books/", {
    ".text": (path: string) => new TextLoader(path),
  });

  const docs = await directoryLoader.load();
  return docs;
}

async function generateDataStore() {
  const documents = await loadDocuments();
  const chunks = await splitText(documents);
  const embeddings = await generateEmbeddings(chunks);
  await saveToQDrant(embeddings);
  return;
}

async function saveToQDrant(points: any) {
  try {
    await QDrant.upsert("bryan_johnson_data", { points });
  } catch (error) {
    console.log(error);
  }
  return;
}

async function generateEmbeddings(chunks: any) {
  let embeddings: any[] = [];
  //   chunks = chunks.slice(0, 2);
  const textOfChunks = chunks.map((chunk: any) => chunk.pageContent); // Needs to be less than 2048 items in array https://platform.openai.com/docs/api-reference/embeddings/create
  try {
    const { data } = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: textOfChunks,
    });
    // Add the chunks metadta to the embeddings and convert to points
    embeddings = data.map(({ embedding, index }) => ({
      id: index,
      vector: embedding,
      payload: chunks[index].metadata,
    }));
  } catch (error) {
    console.error(error);
  }

  return embeddings;
}

async function splitText(documents: any) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 100,
    lengthFunction: (doc: any) => doc.length,
  });
  const chunks = await splitter.splitDocuments(documents);
  console.log(
    `Split ${documents.length} documents into ${chunks.length} chunks.`
  );

  return chunks;
}

// generateDataStore()
//   .then((documents: any) => {
//     console.log(documents);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// CREATED
// QDrant.createCollection("bryan_johnson_data", {
//   vectors: { size: 1536, distance: "Cosine" },
// });
