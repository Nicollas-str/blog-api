import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { userSchema } from "./schemas/users-response.schema";
import { disciplineSchema } from "./schemas/disciplines-response.schema";
import { statusSchema } from "./schemas/statuses-response.schema";

export function registerCatalogDocs(registry: OpenAPIRegistry) {
  registry.register("CatalogUser", userSchema);
  registry.register("CatalogDiscipline", disciplineSchema);
  registry.register("CatalogStatus", statusSchema);

  registry.registerPath({
    method: "get",
    path: "/catalog/users",
    tags: ["Catalog"],
    summary: "Lista usuários disponíveis",
    responses: {
      200: {
        description: "Lista de usuários",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(userSchema),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/catalog/disciplines",
    tags: ["Catalog"],
    summary: "Lista disciplinas disponíveis",
    responses: {
      200: {
        description: "Lista de disciplinas",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(disciplineSchema),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/catalog/statuses",
    tags: ["Catalog"],
    summary: "Lista status disponíveis",
    responses: {
      200: {
        description: "Lista de status",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(statusSchema),
            }),
          },
        },
      },
    },
  });
}
