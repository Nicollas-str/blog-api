import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createPostSchema,
  updatePartialPostSchema,
} from "../schemas/posts.schema";

export function registerPostDocs(registry: OpenAPIRegistry) {
  const objectIdParam = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID inválido do MongoDB");

  registry.register("CreatePost", createPostSchema);
  registry.register("UpdatePartialPost", updatePartialPostSchema);

  const postResponseSchema = z.object({
    _id: z.string().meta({ description: "ID gerado pelo banco" }),
    ...createPostSchema.shape,
    createDate: z.iso.datetime().meta({ description: "Data de criação" }),
    updateDate: z.iso
      .datetime()
      .meta({ description: "Data da última atualização" }),
  });

  registry.register("PostResponse", postResponseSchema);

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
}
