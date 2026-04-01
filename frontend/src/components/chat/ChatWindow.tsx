import { useState, useEffect, useRef } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage.tsx';
import { ChatInput } from './ChatInput.tsx';
import { useChat } from '../../contexts/ChatContext';
import { getChatMessages, saveMessage, type Message } from '../../services/chat.service';
import './ChatWindow.css';

export function ChatWindow() {
  const { currentChatId, createNewChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMessages() {
      if (!currentChatId) {
        setMessages([]);
        return;
      }
      try {
        setIsLoadingMessages(true);
        const res = await getChatMessages(currentChatId);
        setMessages(res.messages);
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    loadMessages();
  }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    // Optimistic UI update
    const tempUserId = `temp-user-${Date.now()}`;
    const optimisticMsg: Message = { id: tempUserId, role: 'user', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsTyping(true);

    let activeChatId = currentChatId;

    try {
      if (!activeChatId) {
        // Create new chat auto-named
        const title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        const newChat = await createNewChat(title);
        activeChatId = newChat.id;
      }

      // Save user message
      const { message: savedUserMsg } = await saveMessage(activeChatId, 'user', content);
      
      // Update temp msg
      setMessages(prev => prev.map(m => m.id === tempUserId ? savedUserMsg : m));

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const botReply = `**Você disse:** "${content}"`;
      const { message: savedBotMsg } = await saveMessage(activeChatId, 'assistant', botReply);

      setMessages(prev => [...prev, savedBotMsg]);
      
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => prev.filter(m => m.id !== tempUserId));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="model-selector">
          <span className="model-name">Modelo TCC (TS/React)</span>
        </div>
      </header>
      
      <div className="chat-messages-container">
        {isLoadingMessages ? (
          <div className="empty-chat">
            <Loader2 className="animate-spin" size={32} color="var(--accent-color)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Como posso ajudar você hoje?</h2>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            
            {isTyping && (
              <div className="chat-message-row assistant">
                <div className="chat-message-content">
                  <div className="avatar assistant-avatar">
                    <Bot />
                  </div>
                  <div className="message-bubble assistant-bubble typing-indicator-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: 1, padding: 10 }} />
          </div>
        )}
      </div>
      
      <div className="chat-input-wrapper">
        <ChatInput onSend={handleSendMessage} />
        <div className="disclaimer">
          TCC Chat pode produzir informações imprecisas sobre pessoas, lugares ou fatos.
        </div>
      </div>
    </div>
  );
}
