import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/db.js';
import { authRoutes } from './routes/auth.routes.js';
import { chatRoutes } from './routes/chat.routes.js';

dotenv.config();

const app = Fastify({ logger: false });

// Register CORS
app.register(cors, {
  origin: true,
  credentials: true,
});

// Register JWT
app.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'fallback-secret-change-in-production',
});

// Register routes
app.register(authRoutes);
app.register(chatRoutes);

// Health check
app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    // Initialize database before starting server
    initializeDatabase();

    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
    console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();