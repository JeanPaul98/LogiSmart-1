import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

type Event = { label: string; date: string; icon: string };
type Document = { name: string; icon: string; action: "view" | "download" };

const MOCK_EVENTS: Event[] = [
  { label: "Colis en transit - Voie routière", date: "18 Jan 2025 - 14:05", icon: "local_shipping" },
  { label: "Scan au hub régional - Accra", date: "18 Jan 2025 - 06:32", icon: "qr_code_scanner" },
  { label: "Chargé à l'entrepôt", date: "17 Jan 2025 - 09:10", icon: "warehouse" },
];

const MOCK_DOCS: Document[] = [
  { name: "Connaissement routier (CMR)", icon: "description", action: "view" },
  { name: "Assurance", icon: "shield", action: "download" },
];

export default function SuiviColis() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentFound, setShipmentFound] = useState(true);
  const [events] = useState<Event[]>(MOCK_EVENTS);
  const [docs] = useState<Document[]>(MOCK_DOCS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert("Veuillez entrer un numéro de suivi");
      return;
    }
    setShipmentFound(true);
  };

  return (
    <MainLayout>
      {/* container non centré, plein large */}
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* ==== HEADER ==== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Suivi de colis</h1>
          <div className="text-xs sm:text-sm text-gray-500">Temps réel</div>
        </div>

        {/* ==== RECHERCHE ==== */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-2">Rechercher une expédition</h2>
          <label htmlFor="tracking-number" className="text-xs sm:text-sm text-gray-500">
            Numéro de suivi
          </label>

          {/* empilement en mobile, flex en >= sm */}
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center">
            <input
              id="tracking-number"
              type="text"
              placeholder="Ex: LGS-ABX908"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="mt-2 sm:mt-0 sm:ml-0 bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none flex items-center justify-center font-semibold"
            >
              <span className="material-icons mr-2 text-lg sm:text-xl">search</span>
              Suivre
            </button>
          </div>
        </form>

        {/* ==== RESULTATS ==== */}
        {shipmentFound ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2">
              {/* Résumé */}
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Résumé de l'envoi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-[11px] sm:text-xs text-yellow-800">Numéro</p>
                    <p className="font-semibold break-all">LGS-ABX908</p>
                  </div>
                  <div className="bg-green-100 p-3 sm:p-4 rounded-lg flex items-center">
                    <span className="material-icons text-green-600 mr-2 text-base sm:text-xl">check_circle</span>
                    <p className="text-sm font-semibold text-green-800">En transit</p>
                  </div>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                    <p className="text-[11px] sm:text-xs text-gray-500">Origine</p>
                    <p className="font-semibold">Accra, GH</p>
                  </div>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                    <p className="text-[11px] sm:text-xs text-gray-500">Destination</p>
                    <p className="font-semibold">Lagos, NG</p>
                  </div>
                </div>
              </div>

              {/* Historique (table scrollable en mobile) */}
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Historique des événements</h2>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-sm min-w-[520px] sm:min-w-0 mx-2 sm:mx-0">
                    <tbody>
                      {events.map((ev, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-3 sm:py-4 pr-2">
                            <div className="flex items-center">
                              <span className="material-icons text-gray-500 mr-3 sm:mr-4 text-base sm:text-lg">
                                {ev.icon}
                              </span>
                              <span className="text-sm sm:text-base">{ev.label}</span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 text-right text-gray-500 text-xs sm:text-sm">
                            {ev.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Destinataire + Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Destinataire</h2>
                  <p className="font-medium">Oluwaseun Ade</p>
                  <p className="text-sm text-gray-500">Ikeja, Lagos</p>
                  <p className="text-sm text-gray-500 mt-2">📞 +234 700 123 4567</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Documents</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {docs.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 sm:mr-3 text-base sm:text-lg">
                            {d.icon}
                          </span>
                          <p className="text-sm sm:text-base">{d.name}</p>
                        </div>
                        <button className="self-start sm:self-auto bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold">
                          {d.action === "view" ? "Voir" : "Télécharger"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne progression */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 h-full">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Progression</h2>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcDTY3EWMA2lRRe-D3W7E8GMxGuc_6eSD-hRzomX7O_lPlwPo7r9FBIDIkrn33dkKJGY9ZcikT9_Jia7UwpswmYfMUlMNTX9qGrawvlWTuHf2nUZKUMsmw9mMVP36Mu2r9tKCIi9NUfQ8P9fOBFt1uVFvytKkg-0ki91SkCeVGrBeU1dnW5FP5etFM3kRIldW_wAWC3lUVn8V8yTaeWPoHZaI-WPvixXIwTtIILxKIv45rtH8ePEob7qZzPJPUC30NIsAsjFRR8rb2"
                  alt="Carte du trajet Accra → Lagos"
                  className="w-full h-auto rounded-lg mb-4 sm:mb-6 object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">Aucun envoi trouvé pour ce numéro.</p>
        )}
      </div>
    </MainLayout>
  );
}
