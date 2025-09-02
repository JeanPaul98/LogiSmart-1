import React from 'react';
import { Link, useLocation } from 'wouter';

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const isActive = (href: string) => location === href;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
         <div className="text-xl font-bold text-orange-600">LogiSmart</div>
      </div>

      <nav className="flex-grow px-4">
        {/* NAVIGATION */}
        <ul>
          {[
            { label: 'Tableau de bord', href: '/dashboard' },
            { label: 'Calculateur', href: '/calcul' },
            { label: 'Suivi de colis', href: '/suivi' },
            { label: 'Recherche SH', href: '/recherche' },
            { label: 'Profil & Historique', href: '/profil' },
          ].map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center p-3 rounded-lg font-medium ${
                  isActive(href)
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RACCOURCIS */}
        <p className="text-xs text-gray-500 uppercase px-4 mt-6 mb-2">Raccourcis</p>
        <ul>
          {[
            {  label: 'Nouveau devis', href: '/devis' },
            {  label: 'Activité récente', href: '/historique' },
          ].map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2025 LogiSmart</p>
      </div>
    </aside>
  );
};

export default Sidebar;
