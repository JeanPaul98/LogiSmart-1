import { Link, useLocation } from "wouter";
import { Home, Plus, Headphones, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BottomNav() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t("nav.home") },
    { path: "/create", icon: Plus, label: t("nav.create") },
    { path: "/support", icon: Headphones, label: t("nav.support") },
    { path: "/dashboard", icon: User, label: t("nav.account") },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 ${
                  isActive ? "text-primary-600" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
