import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify();

app.register(cors, {
  origin: true,
});

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Backend running on http://localhost:3001");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();