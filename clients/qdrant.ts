import { QdrantClient } from "@qdrant/js-client-rest";

require("dotenv").config();

const client = new QdrantClient({
  url: "https://98482ae3-9b8b-4d5e-bef5-9bd362178446.europe-west3-0.gcp.cloud.qdrant.io:6333",
  apiKey: process.env.QDRANT_API_KEY,
});

export default client;
