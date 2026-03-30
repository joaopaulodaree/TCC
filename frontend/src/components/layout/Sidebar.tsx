import { MessageSquare, Plus, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn">
          <div className="new-chat-icon">
            <Plus size={16} />
          </div>
          <span className="new-chat-text">New chat</span>
        </button>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>
      
      <div className="sidebar-content">
        {/* Placeholder for history items */}
        <div className="history-group">
          <p className="history-title">Today</p>
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
        <button className="footer-item">
          <Settings size={18} />
          <span className="footer-text">Settings</span>
        </button>
      </div>
    </div>
  );
}
