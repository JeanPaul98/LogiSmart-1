import { ReactNode } from "react";
import { Bell, Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

export default function Layout({ 
  children, 
  showHeader = true, 
  showBottomNav = true 
}: LayoutProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {showHeader && (
        <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6" />
              <h1 className="text-xl font-bold">LogiSmart</h1>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="bg-white/20 text-white text-sm rounded px-2 py-1 border-0 outline-none"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}
      
      <main className={showBottomNav ? "pb-20" : ""}>
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
