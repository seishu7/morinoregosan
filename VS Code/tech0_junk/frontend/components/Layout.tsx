import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            {children}
          </main>
        </div>
      )}
      {!showSidebar && (
        <main className="p-6">
          {children}
        </main>
      )}
    </div>
  );
};

export default Layout;