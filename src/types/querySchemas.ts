export type Query = {
  q: string;
  n: number;
};

export const querySchema = {
  description: 'API to answer questions via RAG query requests (Vector DB + LLM)',
  querystring: {
    type: 'object',
    required: ['q'],
    properties: {
      q: { type: 'string', minLength: 3 },
      n: {
        type: 'number',
        maximum: 50,
        minimum: 10,
      },
    },
  },
  tags: ['RAG-API'],
  summary: 'RAG-API',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        role: { type: 'string' },
        content: { type: 'string' },
      },
    },
  },
};

export const loadSchema = {
  description: 'Load documents chunks to vector DB (one time action!)',
  tags: ['Vector-DB-Loader'],
  summary: 'Vector-DB-Loader',
  response: {
    200: {
      description: 'Successful response',
      type: 'string',
    },
  },
};
