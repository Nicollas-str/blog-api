import { Router } from "express";
import catalogRoutes from "./catalog.routes";
import postsRoutes from "./posts.routes";

// Bloco: agregador central das rotas públicas da aplicação.
const routes = Router();

routes.use("/posts", postsRoutes);
routes.use(catalogRoutes);

export default routes;
