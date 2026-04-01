import { FastifyInstance } from 'fastify';
import {
  listChats,
  createChat,
  updateChatTitle,
  deleteChat,
  getChatMessages,
  saveMessage,
} from '../controllers/chat.controller.js';

export async function chatRoutes(app: FastifyInstance) {
  app.get('/chats', listChats);
  app.post('/chats', createChat);
  app.patch('/chats/:chatId', updateChatTitle);
  app.delete('/chats/:chatId', deleteChat);
  app.get('/chats/:chatId/messages', getChatMessages);
  app.post('/chats/:chatId/messages', saveMessage);
}
