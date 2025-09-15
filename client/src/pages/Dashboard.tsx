// src/pages/CalculTarif.tsx
import React, { useMemo, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

/* ===========================
   Types
=========================== */
type Shipment = {
  id: number;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: "draft" | "confirmed" | "in_transit" | "customs_clearance" | "delivered" | "cancelled";
  transportMode: "air" | "sea" | "road";
  createdAt: string; // ISO or display
  eta?: string;
};

type TrackingEvent = {
  status: string;
  location: string;
  timestamp: string;
};

/* ===========================
   Mock data (remplace par tes fetchs)
=========================== */
const MOCK_RECENT: Shipment[] = [
  { id: 1, trackingNumber: "LGS-ABX908", origin: "Accra, GH", destination: "Lagos, NG", status: "in_transit", transportMode: "road", createdAt: "2025-01-18 10:12", eta: "2025-01-20" },
  { id: 2, trackingNumber: "LGS-QWE552", origin: "Dakar, SN", destination: "Abidjan, CI", status: "confirmed", transportMode: "air", createdAt: "2025-01-17 08:33", eta: "2025-01-19" },
  { id: 3, trackingNumber: "LGS-ZZZ111", origin: "Lomé, TG", destination: "Cotonou, BJ", status: "customs_clearance", transportMode: "sea", createdAt: "2025-01-16 14:47" },
];

const MOCK_ALL: Shipment[] = [
  ...MOCK_RECENT,
  { id: 4, trackingNumber: "LGS-POI772", origin: "Tema, GH", destination: "Takoradi, GH", status: "delivered", transportMode: "road", createdAt: "2025-01-10 12:02", eta: "2025-01-12" },
  { id: 5, trackingNumber: "LGS-AAA222", origin: "Accra, GH", destination: "Kumasi, GH", status: "draft", transportMode: "road", createdAt: "2025-01-08 09:21" },
  { id: 6, trackingNumber: "LGS-MLK333", origin: "Bamako, ML", destination: "Niamey, NE", status: "in_transit", transportMode: "road", createdAt: "2025-01-05 17:45" },
];

const MOCK_TRACKING: Record<string, TrackingEvent[]> = {
  "LGS-ABX908": [
    { status: "Colis en transit - Voie routière", location: "Ibadan, NG", timestamp: "2025-01-18 14:05" },
    { status: "Scan au hub régional", location: "Accra, GH", timestamp: "2025-01-18 06:32" },
    { status: "Chargé à l'entrepôt", location: "Accra, GH", timestamp: "2025-01-17 09:10" },
  ],
};

/* ===========================
   UI helpers
=========================== */
const Badge = ({ children, color = "gray" }: { children: React.ReactNode; color?: "blue"|"green"|"amber"|"gray"|"red" }) => {
  const map: Record<string,string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return <span className={`px-2 py-1 text-xs rounded-md border ${map[color]}`}>{children}</span>;
};

const statusToBadge = (s: Shipment["status"]) => {
  switch (s) {
    case "in_transit": return <Badge color="blue">En transit</Badge>;
    case "confirmed": return <Badge color="green">Confirmé</Badge>;
    case "customs_clearance": return <Badge color="amber">Douane</Badge>;
    case "delivered": return <Badge color="green">Livré</Badge>;
    case "cancelled": return <Badge color="red">Annulé</Badge>;
    default: return <Badge>Draft</Badge>;
  }
};

const modeIcon = (m: Shipment["transportMode"]) => {
  if (m === "air") return "✈️";
  if (m === "sea") return "🚢";
  return "🚚";
};

/* ===========================
   Page
=========================== */
export default function CalculTarif() {
  // Filtre liste
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_ALL;
    return MOCK_ALL.filter(s =>
      s.trackingNumber.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  }, [query]);

  // Tracking form + résultat
  const [trackNo, setTrackNo] = useState("");
  const [events, setEvents] = useState<TrackingEvent[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const onSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const t = trackNo.trim();
    if (!t) return;
    // brancher ici ton endpoint: GET /api/shipments/:trackingNumber/events
    // fetch(...).then(r => setEvents(r.events)); setNotFound(false);
    if (MOCK_TRACKING[t]) {
      setEvents(MOCK_TRACKING[t]);
      setNotFound(false);
    } else {
      setEvents(null);
      setNotFound(true);
    }
  };

  return (
    <MainLayout>
      {/* Conteneur plein large, non centré, avec padding responsive */}
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tableau de bord logistique</h1>
          <div className="text-xs text-gray-500">Dernière mise à jour : {new Date().toLocaleString()}</div>
        </div>

        {/* Bandeau Dernières expéditions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {MOCK_RECENT.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{s.trackingNumber}</div>
                {statusToBadge(s.status)}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-lg">{modeIcon(s.transportMode)}</span>
                {s.origin} → {s.destination}
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Créé : {s.createdAt}</span>
                <span>ETA : {s.eta || "—"}</span>
              </div>
              <button className="mt-1 self-start text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">
                Détails
              </button>
            </div>
          ))}
        </section>

        {/* Grille principale: Liste + Carte/Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des expéditions */}
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl">
            <div className="px-4 py-3 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Liste des expéditions</h2>
                <p className="text-xs text-gray-500">Filtre sur numéro, origine, destination, statut…</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100">
                  Export
                </button>
              </div>
            </div>

            {/* Table responsive */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">N° Suivi</th>
                    <th className="px-4 py-3 font-medium">Origine</th>
                    <th className="px-4 py-3 font-medium">Destination</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Créé</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.trackingNumber}</td>
                      <td className="px-4 py-3">{s.origin}</td>
                      <td className="px-4 py-3">{s.destination}</td>
                      <td className="px-4 py-3">{modeIcon(s.transportMode)} <span className="ml-1 uppercase text-xs">{s.transportMode}</span></td>
                      <td className="px-4 py-3">{statusToBadge(s.status)}</td>
                      <td className="px-4 py-3 text-gray-500">{s.createdAt}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">Voir</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        Aucune expédition ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Carte + Recherche tracking */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Localiser un colis</h2>
            <p className="text-xs text-gray-500 mb-4">Rechercher l’emplacement via le numéro de suivi.</p>

            <form onSubmit={onSearchTracking} className="flex flex-col sm:flex-row gap-2">
              <input
                value={trackNo}
                onChange={(e) => setTrackNo(e.target.value)}
                placeholder="Ex: LGS-ABX908"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="h-10 rounded-md bg-blue-600 px-4 text-white text-sm font-semibold hover:bg-blue-700 w-full sm:w-auto"
              >
                Rechercher
              </button>
            </form>

            {/* Carte simple (placeholder) */}
            <div className="mt-4 h-56 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
              Carte / Trajet (intégration Map à brancher)
            </div>

            {/* Résultats tracking */}
            <div className="mt-4">
              {notFound && <p className="text-sm text-red-600">Aucun événement trouvé pour ce numéro.</p>}
              {events && (
                <ol className="space-y-4">
                  {events.map((ev, idx) => (
                    <li key={idx} className="relative pl-6">
                      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <div className="text-sm font-medium text-gray-900">{ev.status}</div>
                      <div className="text-xs text-gray-500">{ev.location} • {ev.timestamp}</div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
