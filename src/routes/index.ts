import { Router } from "express";
import catalogRoutes from "./catalog.routes";
import postsRoutes from "./posts.routes";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "../docs/openapi";

// Bloco: agregador central das rotas públicas da aplicação.
const routes = Router();

routes.get("/", (_req, res) => {
  res.redirect("/docs");
});

routes.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
  }),
);
routes.use("/posts", postsRoutes);
routes.use("/catalog", catalogRoutes);

export default routes;
