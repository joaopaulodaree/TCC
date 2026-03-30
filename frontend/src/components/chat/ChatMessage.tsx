import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatMessage.css';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  role: string;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`chat-message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="chat-message-content">
        {!isUser && (
          <div className="avatar assistant-avatar">
            <Bot />
          </div>
        )}
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
