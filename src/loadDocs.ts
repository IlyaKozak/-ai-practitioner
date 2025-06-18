import { ChromaClient } from "chromadb";

import { createDocChunks } from "./createDocChunks";

const BATCH_SIZE = 250;

const client = new ChromaClient({});

export async function loadDocsToDB(subfolders: string[]): Promise<void> {
  const collection = await client.getOrCreateCollection({
    name: "MIA-Artworks",
  });

  for (const directoryPath of subfolders) {
    const chunkDocs = await createDocChunks(directoryPath);

    for (let i = 0; i < chunkDocs.length; i += BATCH_SIZE) {
      try {
        console.log(new Date().toISOString(), directoryPath, i);
        await collection.upsert({
          documents: chunkDocs
            .slice(i, i + BATCH_SIZE)
            .map((doc) => doc.pageContent),
          metadatas: chunkDocs.slice(i, i + BATCH_SIZE).map((doc) => {
            const metadata = { ...doc.metadata };
            if (metadata.loc) metadata.loc = String(metadata.loc);
            return metadata;
          }),
          ids: chunkDocs
            .slice(i, i + BATCH_SIZE)
            .map((doc, idx) => `${doc.metadata.id}-${idx}`),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
