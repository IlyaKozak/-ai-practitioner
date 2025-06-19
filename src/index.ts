import 'dotenv/config';
import fastify from 'fastify';
import path from 'path';
import { ChromaClient, Collection } from 'chromadb';

import { loadDocsToDB } from './loadDocs';
import { getSubFoldersToLoad } from './getSubfoldersToLoad';
import { loadSchema, Query, querySchema } from './types/querySchemas';
import { queryDB } from './queryDB';
import { askLLM } from './askLLM';
import { COLLECTION_NAME, COLLECTION_PATH } from './const';
import { DocToLLM } from './types/docType';
import { swaggerOptions, swaggerUiOptions } from './swaggerOptions';

const client = new ChromaClient({});
let collection: Collection | null = null;

const server = fastify({ logger: true });

server.register(import('@fastify/swagger'), swaggerOptions);

server.register(import('@fastify/swagger-ui'), swaggerUiOptions);

server.register(import('@fastify/static'), {
  root: path.join(__dirname, '/public'),
  prefix: '/',
});

server.register((_, __, done) => {
  server.route<{ Querystring: Query }>({
    method: 'GET',
    url: '/query',
    schema: querySchema,
    handler: async ({ query }) => {
      const { q, n } = query;
      const docsFromDB = await queryDB(q, n, collection);
      console.log(docsFromDB);

      const docsToLLM: DocToLLM[] = docsFromDB?.metadatas[0].map(
        (metadata, idx) =>
          ({
            ...metadata,
            chunk: docsFromDB?.documents[0][idx],
          } as DocToLLM)
      )!;

      const LLMresponse = await askLLM(
        q,
        docsToLLM.reduce((acc, doc) => '<<<|>>>' + JSON.stringify(doc) + acc, '<<<|>>>')
      );
      console.log(LLMresponse);

      return LLMresponse;
    },
  });

  // ONE TIME ACTION!
  server.route({
    method: 'GET',
    url: '/loadDocs',
    schema: loadSchema,
    handler: async () => {
      const subfolders = await getSubFoldersToLoad(COLLECTION_PATH);
      if (!subfolders) return 'Check folder path to collection!';

      loadDocsToDB(subfolders, collection);
      return 'The docs are loaded!';
    },
  });

  done();
});

server.listen({ port: 8080 }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
  });
  console.log(collection);
  console.log(`Server listening at ${address}`);
});
