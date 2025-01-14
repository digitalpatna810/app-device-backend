import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Device Manager API',
      version: '1.0.0',
      description: 'API Documentation for Device Manager'
    },
    servers: [
      {
        url: process.env.BASE_URL, 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ['./src/swagger/*.ts'], 
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerDocs;