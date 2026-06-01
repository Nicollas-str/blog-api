import "ascii-art-say";
import "./config/zod";
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/database";
import { resetMemoryStore } from "./services/memory-data.service";

dotenv.config();

// Bloco: leitura das variáveis de ambiente usadas no bootstrap da API.
const PORT: number = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "";
const USE_IN_MEMORY_DB = process.env.USE_IN_MEMORY_DB === "true";

// Bloco: inicialização da aplicação com conexão MongoDB ou fallback local em memória.
const start = async (): Promise<void> => {
  if (!USE_IN_MEMORY_DB && !MONGODB_URI) {
    throw new Error("MONGODB_URI não definida no .env");
  }

  if (USE_IN_MEMORY_DB) {
    // Fallback local para desenvolvimento e testes manuais sem dependência externa de banco.
    resetMemoryStore();
    console.log("API iniciada em modo local com dados em memória.");
  } else {
    await connectDB(MONGODB_URI);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

start().catch((error: Error) => {
  console.error(`Falha ao iniciar a aplicação: ${error.message}`);
  process.exit(1);
});
