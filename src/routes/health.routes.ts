import { Router } from "express";
import { showHealth } from "../controllers/health.controller";

const healthRoutes = Router();

healthRoutes.get("/", showHealth);

export default healthRoutes;
