import { Router } from "express";
import { listDisciplines, listStatuses, listUsers } from "../controllers/catalog.controller";

// Bloco: rotas auxiliares para consultar catálogos usados no cadastro de posts.
const catalogRoutes = Router();

catalogRoutes.get("/users", listUsers);
catalogRoutes.get("/disciplines", listDisciplines);
catalogRoutes.get("/status", listStatuses);

export default catalogRoutes;