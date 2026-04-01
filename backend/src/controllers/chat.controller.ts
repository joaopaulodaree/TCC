import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { db } from '../database/db.js';
import { z } from 'zod';

type JWTUser = { id: string; name: string; email: string };

async function verifyAuth(request: FastifyRequest, reply: FastifyReply): Promise<JWTUser | null> {
  try {
    await request.jwtVerify();
    return request.user as JWTUser;
  } catch {
    reply.status(401).send({ error: 'Não autorizado. Faça login novamente.' });
    return null;
  }
}

// GET /chats — list all chats for the authenticated user
export async function listChats(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const chats = db
    .prepare(
      `SELECT id, title, created_at, updated_at
       FROM chats
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
    .all(user.id);

  return reply.send({ chats });
}

// POST /chats — create a new chat
export async function createChat(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const bodySchema = z.object({
    title: z.string().max(200).optional(),
  });

  const parsed = bodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0].message });
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const title = parsed.data.title ?? 'Novo chat';

  db.prepare(
    'INSERT INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, user.id, title, now, now);

  return reply.status(201).send({ chat: { id, title, created_at: now, updated_at: now } });
}

// PATCH /chats/:chatId — update chat title
export async function updateChatTitle(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const { chatId } = request.params as { chatId: string };

  const bodySchema = z.object({ title: z.string().min(1).max(200) });
  const parsed = bodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0].message });
  }

  const chat = db
    .prepare('SELECT id FROM chats WHERE id = ? AND user_id = ?')
    .get(chatId, user.id);

  if (!chat) {
    return reply.status(404).send({ error: 'Chat não encontrado.' });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE chats SET title = ?, updated_at = ? WHERE id = ?').run(
    parsed.data.title,
    now,
    chatId
  );

  return reply.send({ success: true });
}

// DELETE /chats/:chatId — delete a chat and its messages
export async function deleteChat(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const { chatId } = request.params as { chatId: string };

  const chat = db
    .prepare('SELECT id FROM chats WHERE id = ? AND user_id = ?')
    .get(chatId, user.id);

  if (!chat) {
    return reply.status(404).send({ error: 'Chat não encontrado.' });
  }

  db.prepare('DELETE FROM chats WHERE id = ?').run(chatId);

  return reply.send({ success: true });
}

// GET /chats/:chatId/messages — get messages from a chat
export async function getChatMessages(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const { chatId } = request.params as { chatId: string };

  const chat = db
    .prepare('SELECT id FROM chats WHERE id = ? AND user_id = ?')
    .get(chatId, user.id);

  if (!chat) {
    return reply.status(404).send({ error: 'Chat não encontrado.' });
  }

  const messages = db
    .prepare(
      `SELECT id, role, content, created_at
       FROM messages
       WHERE chat_id = ?
       ORDER BY created_at ASC`
    )
    .all(chatId);

  return reply.send({ messages });
}

// POST /chats/:chatId/messages — save a message
export async function saveMessage(request: FastifyRequest, reply: FastifyReply) {
  const user = await verifyAuth(request, reply);
  if (!user) return;

  const { chatId } = request.params as { chatId: string };

  const bodySchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  });

  const parsed = bodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0].message });
  }

  const chat = db
    .prepare('SELECT id FROM chats WHERE id = ? AND user_id = ?')
    .get(chatId, user.id);

  if (!chat) {
    return reply.status(404).send({ error: 'Chat não encontrado.' });
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    'INSERT INTO messages (id, chat_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, chatId, parsed.data.role, parsed.data.content, now);

  // Update chat's updated_at timestamp
  db.prepare('UPDATE chats SET updated_at = ? WHERE id = ?').run(now, chatId);

  return reply.status(201).send({
    message: { id, role: parsed.data.role, content: parsed.data.content, created_at: now },
  });
}
