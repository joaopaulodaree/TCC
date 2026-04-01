import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from '../database/db.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      error: parsed.error.issues[0].message,
    });
  }

  const { name, email, password } = parsed.data;

  // Check if email already exists
  const existingEmail = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);
  if (existingEmail) {
    return reply.status(409).send({ error: 'Este email já está em uso.' });
  }

  // Check if name already exists
  const existingName = db
    .prepare('SELECT id FROM users WHERE name = ?')
    .get(name);
  if (existingName) {
    return reply.status(409).send({ error: 'Este nome de usuário já está em uso.' });
  }

  const id = randomUUID();
  const password_hash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();

  db.prepare(
    'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, name, email, password_hash, now);

  // Create default settings for user
  db.prepare(
    'INSERT INTO user_settings (user_id, theme, language, updated_at) VALUES (?, ?, ?, ?)'
  ).run(id, 'dark', 'pt-BR', now);

  const token = await reply.jwtSign(
    { id, name, email },
    { expiresIn: '7d' }
  );

  return reply.status(201).send({
    token,
    user: { id, name, email, created_at: now },
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      error: parsed.error.issues[0].message,
    });
  }

  const { email, password } = parsed.data;

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as
    | { id: string; name: string; email: string; password_hash: string; created_at: string }
    | undefined;

  if (!user) {
    return reply.status(401).send({ error: 'Email ou senha incorretos.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return reply.status(401).send({ error: 'Email ou senha incorretos.' });
  }

  const token = await reply.jwtSign(
    { id: user.id, name: user.name, email: user.email },
    { expiresIn: '7d' }
  );

  return reply.send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
  });
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Token inválido ou expirado.' });
  }

  const payload = request.user as { id: string; name: string; email: string };

  const user = db
    .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
    .get(payload.id) as
    | { id: string; name: string; email: string; created_at: string }
    | undefined;

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado.' });
  }

  const settings = db
    .prepare('SELECT theme, language FROM user_settings WHERE user_id = ?')
    .get(user.id) as { theme: string; language: string } | undefined;

  return reply.send({ user, settings });
}
