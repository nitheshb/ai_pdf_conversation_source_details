// import { PineconeClient } from "@pinecone-database/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

// Create pineconeIndex if it doesn't exist
async function createIndex(client: any, indexName: string) {
  try {
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
        metric: "cosine",
      },
    });
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    // const pineconeClient = new PineconeClient();
    // await pineconeClient.init({
    //   apiKey: env.PINECONE_API_KEY,
    //   environment: env.PINECONE_ENVIRONMENT,
    // });
    const pinecone = new Pinecone({
      apiKey: 'ea3cdba2-c6ab-438a-890d-6c07c089a645',
    });
    
    // export const searchIndexName = "cuzo-embedding-search";
    const indexName = env.PINECONE_INDEX_NAME;
     const searchIndexName = "pdfrobo";
    
     const searchIndex = pinecone.Index(searchIndexName);
    const listIndex = await pinecone.listIndexes()


    // const existingIndexes = await pineconeClient.listIndexes();

    // if (!existingIndexes.includes(indexName)) {
    //   createIndex(pineconeClient, indexName);
    // } else {
    //   console.log("Your index already exists. nice !!");
    // }

    return pinecone;
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
