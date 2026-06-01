import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { registerPostDocs } from "./posts.docs";
import { registerCatalogDocs } from "./catalog.docs";

export const registry = new OpenAPIRegistry();

registerPostDocs(registry);
registerCatalogDocs(registry);

export const openApiDocument = new OpenApiGeneratorV3(
  registry.definitions,
).generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Blog API",
    version: "1.0.0",
    description: "Documentação da API",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
});
