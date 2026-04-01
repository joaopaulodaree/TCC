import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getChats, createChat as apiCreateChat, deleteChat as apiDeleteChat, type Chat } from '../services/chat.service';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  isLoadingChats: boolean;
  selectChat: (id: string | null) => void;
  loadChats: () => Promise<void>;
  createNewChat: (title: string) => Promise<Chat>;
  removeChat: (id: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  const loadChats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingChats(true);
      const res = await getChats();
      setChats(res.chats);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setIsLoadingChats(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadChats();
    } else {
      setChats([]);
      setCurrentChatId(null);
    }
  }, [isAuthenticated, loadChats]);

  const selectChat = useCallback((id: string | null) => {
    setCurrentChatId(id);
  }, []);

  const createNewChat = useCallback(async (title: string) => {
    const res = await apiCreateChat(title);
    setChats(prev => [res.chat, ...prev]);
    setCurrentChatId(res.chat.id);
    return res.chat;
  }, []);

  const removeChat = useCallback(async (id: string) => {
    try {
      await apiDeleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) {
        setCurrentChatId(null);
      }
    } catch (err) {
      alert('Erro ao apagar chat: ' + (err as Error).message);
      console.error('Failed to delete chat:', err);
    }
  }, [currentChatId]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        isLoadingChats,
        selectChat,
        loadChats,
        createNewChat,
        removeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
