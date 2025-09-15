import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Menu, User, LogOut, Settings } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Bouton burger pour mobile */}
        <button
          className="lg:hidden text-gray-700 hover:text-gray-900"
          onClick={onToggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-orange-600">
          LogiSmart
        </Link>

        {/* Menu utilisateur */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-gray-200 p-2 hover:bg-gray-50 focus:outline-none"
          >
            <User className="w-5 h-5 text-gray-700" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              Mon compte
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
              <Link
                href="/profil"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  // 👉 logique de déconnexion à brancher ici
                  alert("Déconnexion...");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
