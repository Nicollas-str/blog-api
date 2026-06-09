import { Router } from "express";
import {
  listUsers, 
  storeUser, 
  updateUserById, 
  removeUser,
  listDisciplines, 
  storeDiscipline, 
  updateDisciplineById, 
  removeDiscipline,
  listStatuses, 
  storeStatus, 
  updateStatusById, 
  removeStatus,
} from "../controllers/catalog.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createDisciplineSchema,
  createStatusSchema,
  createUserSchema,
  updateDisciplineSchema,
  updateStatusSchema,
  updateUserSchema,
} from "../schemas/catalog.schema";

// Bloco: rotas auxiliares para consultar catálogos usados no cadastro de posts.

const catalogRoutes = Router();

// ── Usuários ──────────────────────────────────────────────────────────────────
catalogRoutes.get("/users", listUsers);
catalogRoutes.post("/users", validate(createUserSchema), storeUser);
catalogRoutes.put("/users/:id", validate(updateUserSchema), updateUserById);
catalogRoutes.delete("/users/:id", removeUser);

// ── Disciplinas ───────────────────────────────────────────────────────────────
catalogRoutes.get("/disciplines", listDisciplines);
catalogRoutes.post("/disciplines", validate(createDisciplineSchema), storeDiscipline);
catalogRoutes.put("/disciplines/:id", validate(updateDisciplineSchema), updateDisciplineById);
catalogRoutes.delete("/disciplines/:id", removeDiscipline);

// ── Status ────────────────────────────────────────────────────────────────────
catalogRoutes.get("/status", listStatuses);
catalogRoutes.post("/status", validate(createStatusSchema), storeStatus);
catalogRoutes.put("/status/:id", validate(updateStatusSchema), updateStatusById);
catalogRoutes.delete("/status/:id", removeStatus);

export default catalogRoutes;