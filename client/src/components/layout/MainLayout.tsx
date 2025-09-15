import React, { ReactNode, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-800 flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Sidebar Mobile (overlay + slide) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-50 w-64 transform transition-transform duration-300 ease-in-out translate-x-0">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
        {/* Footer */}
        <footer className="text-xs text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-2 mt-8">
          <span>Contact: support@logismart.africa</span>
          <span className="hidden sm:inline">|</span>
          <a className="hover:underline" href="#">Centre d'aide</a>
          <span className="hidden sm:inline">|</span>
          <a className="hover:underline" href="#">Conditions</a>
          <span className="hidden sm:inline">|</span>
          <a className="hover:underline" href="#">Confidentialité</a>
          <span className="ml-auto text-gray-400">© 2025 LogiSmart</span>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
