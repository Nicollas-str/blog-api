import mongoose from "mongoose";

export const connectDB = async (
  uri: string,
): Promise<typeof mongoose.connection> => {
  if (!uri) {
    throw new Error("A variável MONGO_URI não foi informada.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(
      `MongoDB conectado em ${conn.connection.host}:${conn.connection.port}`,
    );

    return conn.connection;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao conectar no MongoDB";

    throw new Error(`Falha na conexão com MongoDB: ${message}`);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB desconectado.");
  }
};
