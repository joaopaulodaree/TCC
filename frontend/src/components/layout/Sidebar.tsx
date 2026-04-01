import { MessageSquare, Plus, PanelLeftClose, PanelLeftOpen, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user, logout } = useAuth();
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn">
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
        {/* Placeholder for history items */}
        <div className="history-group">
          <p className="history-title">Hoje</p>
          <button className="history-item">
            <MessageSquare size={16} />
            <span className="history-text">TCC Project Setup</span>
          </button>
          <button className="history-item">
            <MessageSquare size={16} />
            <span className="history-text">React Configuration</span>
          </button>
        </div>
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
