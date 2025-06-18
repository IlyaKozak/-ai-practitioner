export type Query = {
  q: string;
  n: number;
};

export const querySchema = {
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
};
