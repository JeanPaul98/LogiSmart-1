import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const SuiviColis: React.FC = () => {
  return (
    <MainLayout>
<div className="flex-1 overflow-y-auto">
<div className="flex justify-between items-center mb-6">
<h1 className="text-2xl font-bold">Suivi de colis</h1>
<div className="text-sm text-gray-500">Temps réel</div>
</div>
<div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
<h2 className="text-lg font-semibold mb-2">Rechercher une expédition</h2>
<label className="text-sm text-gray-500" >Numéro de suivi</label>
<div className="flex items-center mt-1">
<input className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500" id="tracking-number" type="text" value="EX: LOS-ABC123456"/>
<button className="bg-orange-500 text-white px-6 py-2 rounded-r-lg flex items-center font-semibold">
<span className="material-icons mr-2 text-xl">search</span>
                            Suivre
                        </button>
<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg ml-4 flex items-center">
<span className="material-icons mr-2">qr_code_scanner</span>
                            Scanner un code
                        </button>
</div>
</div>
<div className="grid grid-cols-3 gap-8">
<div className="col-span-2">
<div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
<h2 className="text-lg font-semibold mb-4">Résumé de l'envoi</h2>
<div className="grid grid-cols-2 gap-4">
<div className="bg-yellow-50 p-4 rounded-lg">
<p className="text-xs text-yellow-800">Numéro</p>
<p className="font-semibold">LGS-ABX908</p>
</div>
<div className="bg-green-100 p-4 rounded-lg flex items-center">
<span className="material-icons text-green-600 mr-2">check_circle</span>
<p className="text-sm font-semibold text-green-800">En transit</p>
</div>
<div className="bg-gray-100 p-4 rounded-lg">
<p className="text-xs text-gray-500">Origine</p>
<p className="font-semibold">Accra, GH</p>
</div>
<div className="bg-gray-100 p-4 rounded-lg">
<p className="text-xs text-gray-500">Destination</p>
<p className="font-semibold">Lagos, NG</p>
</div>
<div className="bg-yellow-50 p-4 rounded-lg">
<p className="text-xs text-yellow-800">Transport</p>
<p className="font-semibold">Routier</p>
</div>
<div className="bg-yellow-50 p-4 rounded-lg">
<p className="text-xs text-yellow-800">ETA</p>
<p className="font-semibold">20 Jan 2025, 16:00</p>
</div>
</div>
<div className="flex space-x-4 mt-4 text-sm">
<div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
<span className="material-icons text-gray-600 text-base mr-1">inventory</span> 3 colis
                                </div>
<div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
<span className="material-icons text-gray-600 text-base mr-1">scale</span> 250 kg
                                </div>
<div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
<span className="material-icons text-gray-600 text-base mr-1">route</span> 540 km
                                </div>
</div>
</div>
<div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
<h2 className="text-lg font-semibold mb-4">Historique des événements</h2>
<div className="flex justify-end space-x-4 mb-4">
<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold">Exporter</button>
<button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">Partager le suivi</button>
</div>
<table className="w-full text-sm">
<tbody>
<tr className="border-b">
<td className="py-4">
<div className="flex items-center">
<span className="material-icons text-gray-500 mr-4">local_shipping</span>
                                                Colis en transit - Voie routière
                                            </div>
</td>
<td className="py-4 text-right text-gray-500">18 Jan 2025 - 14:05</td>
</tr>
<tr className="border-b">
<td className="py-4">
<div className="flex items-center">
<span className="material-icons text-gray-500 mr-4">qr_code_scanner</span>
                                                Scan au hub régional - Accra
                                            </div>
</td>
<td className="py-4 text-right text-gray-500">18 Jan 2025 - 06:32</td>
</tr>
<tr>
<td className="py-4">
<div className="flex items-center">
<span className="material-icons text-gray-500 mr-4">warehouse</span>
                                                Chargé à l'entrepôt
                                            </div>
</td>
<td className="py-4 text-right text-gray-500">17 Jan 2025 - 09:10</td>
</tr>
</tbody>
</table>
</div>
<div className="grid grid-cols-2 gap-8">
<div className="bg-white p-6 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Destinataire</h2>
<div className="space-y-4">
<div className="bg-gray-100 p-3 rounded-lg">
<p className="text-xs text-gray-500">Nom</p>
<p className="font-semibold">Oluwaseun Ade</p>
</div>
<div className="bg-yellow-50 p-3 rounded-lg">
<p className="text-xs text-yellow-800">Téléphone</p>
<p className="font-semibold">+234 700 123 4567</p>
</div>
<div className="bg-gray-100 p-3 rounded-lg">
<p className="text-xs text-gray-500">Adresse</p>
<p className="font-semibold">Ikeja, Lagos</p>
</div>
<div className="bg-yellow-50 p-3 rounded-lg">
<p className="text-xs text-yellow-800">Instructions</p>
<p className="font-semibold">Appeler à l'arrivée</p>
</div>
</div>
</div>
<div className="bg-white p-6 rounded-lg border border-gray-200">
<h2 className="text-lg font-semibold mb-4">Documents</h2>
<div className="space-y-4">
<div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
<div className="flex items-center">
<span className="material-icons text-gray-500 mr-3">description</span>
<p>Connaissement routier (CMR)</p>
</div>
<button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold">Voir</button>
</div>
<div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
<div className="flex items-center">
<span className="material-icons text-gray-500 mr-3">shield</span>
<p>Assurance</p>
</div>
<button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold">Télécharger</button>
</div>
</div>
</div>
</div>
</div>
<div className="col-span-1">
<div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
<h2 className="text-lg font-semibold mb-4">Progression</h2>
<div className="relative">
<img alt="Map showing the route from Accra to Lagos" className="rounded-lg mb-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcDTY3EWMA2lRRe-D3W7E8GMxGuc_6eSD-hRzomX7O_lPlwPo7r9FBIDIkrn33dkKJGY9ZcikT9_Jia7UwpswmYfMUlMNTX9qGrawvlWTuHf2nUZKUMsmw9mMVP36Mu2r9tKCIi9NUfQ8P9fOBFt1uVFvytKkg-0ki91SkCeVGrBeU1dnW5FP5etFM3kRIldW_wAWC3lUVn8V8yTaeWPoHZaI-WPvixXIwTtIILxKIv45rtH8ePEob7qZzPJPUC30NIsAsjFRR8rb2"/>
<div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
</div>
<div className="relative">
<div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
<div className="space-y-8">
<div className="flex items-start">
<div className="z-10 w-5 h-5 bg-orange-500 rounded-full border-4 border-white"></div>
<div className="ml-4 -mt-1">
<p className="font-semibold">Chargé à l'entrepôt d'Accra</p>
<p className="text-sm text-gray-500">17 Jan 2025 - 09:10</p>
</div>
</div>
<div className="flex items-start">
<div className="z-10 w-5 h-5 bg-orange-500 rounded-full border-4 border-white"></div>
<div className="ml-4 -mt-1">
<p className="font-semibold">Sorti du hub régional</p>
<p className="text-sm text-gray-500">18 Jan 2025 - 06:32</p>
</div>
</div>
<div className="flex items-start">
<div className="z-10 w-5 h-5 bg-orange-500 rounded-full border-4 border-white"></div>
<div className="ml-4 -mt-1">
<p className="font-semibold">En transit vers Lagos</p>
<p className="text-sm text-gray-500">18 Jan 2025 - 14:05</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
    </MainLayout>
  );
};

export default SuiviColis;
