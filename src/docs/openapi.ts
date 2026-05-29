import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  createPostSchema,
  updatePartialPostSchema,
} from "../schemas/posts.schema";

export const registry = new OpenAPIRegistry();

const objectIdParam = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "ID inválido do MongoDB");

// ---------------------------------------------------
// SCHEMAS
// ---------------------------------------------------
registry.register("CreatePost", createPostSchema);
registry.register("UpdatePartialPost", updatePartialPostSchema);

// ---------------------------------------------------
// RESPONSE SCHEMA
// ---------------------------------------------------
const postResponseSchema = z.object({
  _id: z.string().meta({ description: "ID gerado pelo banco" }),
  ...createPostSchema.shape,
  createDate: z.string().datetime().meta({ description: "Data de criação" }),
  updateDate: z
    .string()
    .datetime()
    .meta({ description: "Data da última atualização" }),
});

registry.register("PostResponse", postResponseSchema);

// ---------------------------------------------------
// GET POSTS
// ---------------------------------------------------
registry.registerPath({
  method: "get",
  path: "/posts",
  tags: ["Posts"],
  summary: "Lista todos os posts",
  responses: {
    200: {
      description: "Lista de posts retornada com sucesso",
      content: {
        "application/json": {
          schema: z.object({
            posts: z.array(postResponseSchema),
          }),
        },
      },
    },
  },
});

// ---------------------------------------------------
// CREATE POST
// ---------------------------------------------------
registry.registerPath({
  method: "post",
  path: "/posts",
  tags: ["Posts"],
  summary: "Cria um novo post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPostSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post criado com sucesso",
      content: {
        "application/json": {
          schema: postResponseSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------
// UPDATE PUT
// ---------------------------------------------------
registry.registerPath({
  method: "put",
  path: "/posts/{id}",
  tags: ["Posts"],
  summary: "Atualiza post completo",
  request: {
    params: z.object({
      id: objectIdParam,
    }),
    body: {
      content: {
        "application/json": {
          schema: createPostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post atualizado com sucesso",
      content: {
        "application/json": {
          schema: postResponseSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------
// DELETE
// ---------------------------------------------------
registry.registerPath({
  method: "delete",
  path: "/posts/{id}",
  tags: ["Posts"],
  summary: "Remove um post",
  request: {
    params: z.object({
      id: objectIdParam,
    }),
  },
  responses: {
    204: {
      description: "Post removido com sucesso",
    },
  },
});

// ---------------------------------------------------
// OPENAPI DOCUMENT
// ---------------------------------------------------
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
