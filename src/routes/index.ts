import { Router } from "express";
import catalogRoutes from "./catalog.routes";
import postsRoutes from "./posts.routes";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "../docs/openapi";

// Bloco: agregador central das rotas públicas da aplicação.
const routes = Router();

routes.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
  }),
);
routes.use("/posts", postsRoutes);
routes.use(catalogRoutes);

export default routes;
