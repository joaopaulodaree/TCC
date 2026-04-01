import { MessageSquare, Plus, PanelLeftClose, PanelLeftOpen, LogOut, Settings, User, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user, logout } = useAuth();
  const { chats, currentChatId, selectChat, removeChat } = useChat();
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={() => selectChat(null)}>
          <div className="new-chat-icon">
            <Plus size={16} />
          </div>
          <span className="new-chat-text">Novo chat</span>
        </button>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>
      
      <div className="sidebar-content">
        {chats.length > 0 && (
          <div className="history-group">
            <p className="history-title">Seus Chats</p>
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`history-item-wrapper ${currentChatId === chat.id ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="history-item"
                  onClick={() => selectChat(chat.id)}
                >
                  <MessageSquare size={16} style={{ flexShrink: 0, pointerEvents: 'none' }} />
                  <span className="history-text">{chat.title}</span>
                </button>
                <button
                  type="button"
                  className="delete-chat-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeChat(chat.id);
                  }}
                  title="Excluir chat"
                >
                  <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {user && (
          <div className="user-profile">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
            </div>
          </div>
        )}
        <button className="footer-item" onClick={logout}>
          <LogOut size={18} />
          <span className="footer-text">Logout</span>
        </button>
        <button className="footer-item">
          <Settings size={18} />
          <span className="footer-text">Configurações</span>
        </button>
      </div>
    </div>
  );
}
