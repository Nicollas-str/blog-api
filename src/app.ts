import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error.middleware";
import routes from "./routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";
  const dbConnected = useInMemoryDb || mongoose.connection.readyState === 1;

  response.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    service: "blog-api",
    database: useInMemoryDb ? "in-memory" : dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);

app.use(errorMiddleware);

export default app;
