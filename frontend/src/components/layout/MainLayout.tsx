import { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { PanelLeftOpen } from 'lucide-react';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="layout-main">
        {!isSidebarOpen && (
          <button className="open-sidebar-btn" onClick={toggleSidebar}>
            <PanelLeftOpen size={20} />
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
