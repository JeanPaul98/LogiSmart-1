import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Tarifs & Expéditions",
      version: "1.0.0",
      description: "Documentation auto-générée avec Swagger",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["Controller/*.ts", "Routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs dispo sur: http://localhost:${port}/api/docs`);
};
