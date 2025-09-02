import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const CalculTarif: React.FC = () => {
  return (
    <MainLayout>
              <div className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Calculateur de tarifs</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 border border-gray-300 rounded-full">
              <button className="px-4 py-1">National</button>
              <button className="px-4 py-1 bg-white rounded-full shadow-sm text-gray-900">International</button>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Détails de l'expédition</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Origine', placeholder: 'Ville / Pays' },
                { label: 'Destination', placeholder: 'Ville / Pays' },
                { label: 'Mode', placeholder: 'Aérien / Maritime / Routier' },
                { label: 'Poids total', placeholder: 'Ex: 250 kg' },
                { label: 'Volume', placeholder: 'Ex: 1.2 m³' },
                { label: 'Incoterm', placeholder: 'EXW / FOB / CIF...' },
                { label: 'Valeur déclarée', placeholder: 'Ex: $12,000' },
                { label: 'Type de marchandise', placeholder: 'Générale / Fragile / Dangereuse' },
                { label: 'Code SH (optionnel)', placeholder: 'Rechercher un code' },
              ].map((item, index) => (
                <div key={index}>
                  <label className="text-sm font-medium text-gray-700">{item.label}</label>
                  <input
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    type="text"
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Effacer</button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Calculer</button>
            </div>
          </div>

          {/* Estimations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimation des coûts</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  ['Fret', '$420'],
                  ['Frais douaniers', '$260'],
                  ['Assurance', '$35'],
                  ['Dernier km', '$48'],
                ].map(([label, amount], i) => (
                  <div key={i} className="bg-amber-100 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">{label}</p>
                    <p className="text-2xl font-bold text-amber-900">{amount}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Taux estimés, hors taxes locales</p>
                <div className="flex space-x-2">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">Voir détail</button>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">Enregistrer le devis</button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres & options</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  ['Délai souhaité', 'Standard (3-5 j) / Express'],
                  ['Emballage', 'Palette / Cartons / VRAC'],
                  ['Services', 'Collecte / Dégroupage / Douane'],
                  ['Assurance', 'Oui / Non'],
                  ['Paiement', 'Prépayé / À la livraison'],
                  ['Devise', 'USD / EUR / NGN / GHS'],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <div className="bg-gray-100 p-3 rounded-lg text-center font-semibold">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé du devis</h3>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <p className="text-gray-700">Accra → Lagos • Aérien • 250 kg</p>
              <p className="font-semibold text-gray-900">Prêt</p>
            </div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700 font-medium">Total estimé</p>
              <p className="text-2xl font-bold text-gray-900">$763 <span className="text-sm font-normal text-gray-500">ETA 3-4 j</span></p>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Exporter PDF</button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Créer l'expédition</button>
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default CalculTarif;
