import fs from "fs/promises";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

import { Artwork } from "./docType";
import { removeNulls } from "./removeNullsFromObject";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export async function createDocChunks(directoryPath: string) {
  const docs: Document[] = [];
  const filesPaths = await fs.readdir(directoryPath);

  for (const filePath of filesPaths) {
    const fullFilePath = path.join(directoryPath, filePath);
    const fileContent = await fs.readFile(fullFilePath, "utf-8");
    if (!fileContent.trim()) continue;
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
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: [',"'],
  });
  const chunkDocs = await splitter.splitDocuments(docs);

  return chunkDocs;
}
