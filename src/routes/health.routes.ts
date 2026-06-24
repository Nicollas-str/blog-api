import { Router } from "express";
import mongoose from "mongoose";

const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";
  const dbConnected = useInMemoryDb || mongoose.connection.readyState === 1;

  response.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    service: "blog-api",
    database: useInMemoryDb
      ? "in-memory"
      : dbConnected
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default healthRoutes;
