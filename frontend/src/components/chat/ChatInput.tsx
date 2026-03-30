import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import './ChatInput.css';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="chat-input-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          rows={1}
        />
        <button 
          className="send-button"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  );
}
