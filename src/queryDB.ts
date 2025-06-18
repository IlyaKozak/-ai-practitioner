import { Collection } from 'chromadb';

export async function queryDB(query: string, nResults: number, collection: Collection | null) {
  if (!collection) return;
  console.log(collection);

  const results = await collection.query({
    queryTexts: [query],
    nResults: nResults ?? Number(process.env.N_RESULTS),
  });

  return results;
}
