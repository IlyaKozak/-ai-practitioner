import { Collection } from 'chromadb';

import { createDocChunks } from './createDocChunks';

const BATCH_SIZE = Number(process.env.BATCH_SIZE!);

export async function loadDocsToDB(
  subfolders: string[],
  collection: Collection | null
): Promise<void> {
  if (!collection) return;

  for (const directoryPath of subfolders) {
    const chunkDocs = await createDocChunks(directoryPath);

    for (let i = 0; i < chunkDocs.length; i += BATCH_SIZE) {
      try {
        await collection.upsert({
          documents: chunkDocs.slice(i, i + BATCH_SIZE).map((doc) => doc.pageContent),
          metadatas: chunkDocs.slice(i, i + BATCH_SIZE).map((doc) => {
            const metadata = { ...doc.metadata };
            if (metadata.loc) metadata.loc = String(metadata.loc);
            return metadata;
          }),
          ids: chunkDocs.slice(i, i + BATCH_SIZE).map((doc, idx) => `${doc.metadata.id}-${idx}`),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
