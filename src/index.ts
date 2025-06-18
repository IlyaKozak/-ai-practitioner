import fastify from "fastify";

import { loadDocsToDB } from "./loadDocs";
import { getSubFoldersToLoad } from "./getSubfoldersToLoad";

const COLLECTION_PATH = "./collection";

const server = fastify({ logger: true });

server.get("/loadDocs", async () => {
  const subfolders = await getSubFoldersToLoad(COLLECTION_PATH);
  if (!subfolders) return "Check folder path to collection!";

  loadDocsToDB(subfolders);
  return "The docs are loaded!";
});

server.get("/ping", async () => {
  return "pong";
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
