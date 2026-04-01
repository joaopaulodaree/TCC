const API_BASE = 'http://localhost:3001';

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? 'Erro desconhecido');
  }

  return data as T;
}

export async function getChats(): Promise<{ chats: Chat[] }> {
  return apiFetch<{ chats: Chat[] }>('/chats');
}

export async function createChat(title: string): Promise<{ chat: Chat }> {
  return apiFetch<{ chat: Chat }>('/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function deleteChat(chatId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/chats/${chatId}`, {
    method: 'DELETE',
  });
}

export async function getChatMessages(chatId: string): Promise<{ messages: Message[] }> {
  return apiFetch<{ messages: Message[] }>(`/chats/${chatId}/messages`);
}

export async function saveMessage(chatId: string, role: 'user' | 'assistant', content: string): Promise<{ message: Message }> {
  return apiFetch<{ message: Message }>(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ role, content }),
  });
}
