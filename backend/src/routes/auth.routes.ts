import { FastifyInstance } from 'fastify';
import { register, login, getMe } from '../controllers/auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', register);
  app.post('/auth/login', login);
  app.get('/auth/me', getMe);
}
