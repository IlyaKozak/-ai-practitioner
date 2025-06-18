import fs from "fs/promises";
import path from "path";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChromaClient } from "chromadb";

import { Artwork } from "./docType";
import { removeNulls } from "./removeNullsFromObject";

const client = new ChromaClient({});

export async function loadJsonFilesToDB(directoryPath: string): Promise<void> {
  const docs: Document[] = [];

  try {
    const filesPaths = await fs.readdir(directoryPath);

    for (const filePath of filesPaths) {
      const fullFilePath = path.join(directoryPath, filePath);
      const fileContent = await fs.readFile(fullFilePath, "utf-8");
      const artwork: Artwork = JSON.parse(fileContent);

      const doc = new Document({
        pageContent: JSON.stringify(removeNulls(artwork)),
        metadata: {
          source: filePath,
          artist: artwork.artist,
          classification: artwork.classification,
          continent: artwork.continent,
          country: artwork.country,
          dated: artwork.dated,
          id: artwork.id,
          title: artwork.title,
        },
        id: String(artwork.id),
      });

      docs.push(doc);
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: [',"'],
    });
    const chunkDocs = await splitter.splitDocuments(docs);

    const collection = await client.getOrCreateCollection({
      name: "MIA-Artworks",
    });

    await collection.upsert({
      documents: chunkDocs.slice(0, 250).map((doc) => doc.pageContent),
      metadatas: chunkDocs.slice(0, 250).map((doc) => {
        const metadata = { ...doc.metadata };
        if (metadata.loc) metadata.loc = String(metadata.loc);
        return metadata;
      }),
      ids: chunkDocs
        .slice(0, 250)
        .map((doc, idx) => `${doc.metadata.id}-${idx}`),
    });

    const results = await collection.query({
      queryTexts: ["Show me American paintings from the 19th century"],
      nResults: 3,
    });

    console.log(results);
  } catch (error) {
    console.log(error);
  }
}
