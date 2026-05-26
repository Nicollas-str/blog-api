import mongoose from "mongoose";

const connectDB = async (uri: string): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const conn = await mongoose.connect(uri);

  console.log(
    `MongoDB conectado: ${conn.connection.host}:${conn.connection.port}`,
  );
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
};

export default connectDB;
