import React from "react";
import { Link, useLocation } from "wouter";

interface NavItem {
  label: string;
  href: string;
  shortcut?: boolean;
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard" },
  { label: "Obtenir une estimation", href: "/calcul" },
  { label: "Effectuer un envoie", href: "/envoie" },
  { label: "Suivi de colis", href: "/suivi" },
  //{ label: "Search", href: "/search" },
  // { label: "Profil & Historique", href: "/profil" },
];

const SidebarLink: React.FC<{ item: NavItem; active: boolean }> = ({
  item,
  active,
}) => (
  <Link
    href={item.href}
    className={`flex items-center p-3 rounded-lg font-medium transition-colors ${
      active
        ? "bg-orange-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {item.label}
  </Link>
);

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* LOGO */}
      <div className="p-6">
        <div className="text-xl font-bold text-orange-600">LogiSmart</div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow px-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <SidebarLink item={item} active={location === item.href} />
            </li>
          ))}
        </ul>

        {/* RACCOURCIS */}
        <p className="text-xs text-gray-500 uppercase px-4 mt-6 mb-2">
          Raccourcis
        </p>
        <ul>
          {/* Tu pourras ajouter ici des raccourcis comme "Devis", "Historique", etc. */}
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2025 LogiSmart</p>
      </div>
    </aside>
  );
};

export default Sidebar;
