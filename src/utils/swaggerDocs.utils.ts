import { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger/swagger.config";


export const setUpSwaggerDocs = (app: any, port: number): void => {
  app.use('/docs', swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}