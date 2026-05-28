import "./config/zod";
import dotenv from "dotenv";
import app from "./app";
import { connectDB, disconnectDB } from "./config/database";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI não definida no .env");
    }

    await connectDB(mongoUri);

    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("Encerrando aplicação...");
      await disconnectDB();
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Erro ao iniciar aplicação:", error);
    process.exit(1);
  }
}

start();
