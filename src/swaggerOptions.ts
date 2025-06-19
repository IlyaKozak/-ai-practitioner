export const swaggerOptions = {
  swagger: {
    info: {
      title: 'RAG Question-Answering System',
      description: 'RAG Question-Answering System API',
      version: '1.0.0',
    },
    host: 'localhost:8080',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

export const swaggerUiOptions = {
  routePrefix: '/api',
  exposeRoute: true,
};
