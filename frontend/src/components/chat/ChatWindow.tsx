import { useState } from 'react';
import { ChatMessage } from './ChatMessage.tsx';
import { ChatInput } from './ChatInput.tsx';
import './ChatWindow.css';

export function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Olá! Sou o TCC Chat e estou aqui para ajudar você com seu projeto. Como posso auxiliar hoje?'
    }
  ]);

  const handleSendMessage = (message: string) => {
    const newUserMsg = { id: Date.now(), role: 'user', content: message };
    setMessages(prev => [...prev, newUserMsg]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: `Você disse: "${message}".`
      }]);
    }, 1000);
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="model-selector">
          <span className="model-name">TCC Model (TS/React)</span>
        </div>
      </header>
      
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Como posso ajudar você hoje?</h2>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
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
