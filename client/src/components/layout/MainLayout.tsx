import React, { ReactNode } from 'react';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 text-gray-800 flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
        <footer className="bg-white border-t border-gray-200 p-4 text-right">
          <a
            className="text-sm text-gray-600 hover:text-gray-900"
            href="mailto:support@logismart.africa"
          >
            support@logismart.africa
          </a>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
