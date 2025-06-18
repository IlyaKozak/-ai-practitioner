export const BATCH_SIZE = 250;
export const CHUNK_SIZE = 500;
export const CHUNK_OVERLAP = 50;
export const COLLECTION_PATH = './collection';
export const COLLECTION_NAME = 'MIA-Artworks';
export const PROMPT = `There are some objects from Minneapolis Institute of Art collection dataset. 
The objects contain the next info: artist, classification, continent, country, dated, source, chunk.
Analyze info from chunks and choose the best to answer the user question. Answer from the provided information referencing source key. 
Format the answer as html code with ordered lists. The objects strings separated by <<<|>>> provided below: `;
