import swaggerJsdoc from 'swagger-jsdoc';
import AppConfig from './../app.config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management System',
      description: 'API endpoints features',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${AppConfig.server.port}${AppConfig.server.baseURL}`,
        description: 'Local server'
      },
      {
        url: `${AppConfig.server.baseURL}`,
        description: 'Live server'
      }
    ],
    components: {
      securitySchemes: {
        bearerToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/docs/**/*.ts',
    './src/routes/**/*.ts',
    './src/routes/**/**/*.ts'
  ]
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
