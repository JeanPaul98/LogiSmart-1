// src/pages/CalculTarif.tsx
import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

/* ===========================
   Types
=========================== */
export type ShipmentStatus =
  | "registered"
  | "confirmed"
  | "in_transit"
  | "customs_clearance"
  | "delivered"
  | "cancelled"
  | "draft"
  | string;

type Shipment = {
  id: number;
  trackingNumber: string;
  senderAddress: string;
  recipientAddress: string;
  status: ShipmentStatus;
  transportMode: string;
  createdAt: string;
  enlevDate?: string | null;
};

type ShipmentDetail = Shipment & {
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  description?: string;
  originCity?: string;
  destinationCity?: string;
  totalCost?: number;
  customsDuty?: number | null;
  vat?: number | null;
};

type TrackingEvent = {
  status: string;
  location: string;
  timestamp: string;
};

/* ===========================
   Config
=========================== */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

const LIST_URL = `${API_BASE}/api/shipments/list`;
const GET_DETAIL_URL = (id: number) => `${API_BASE}/api/shipments/${id}`;
const PATCH_STATUS_URL = (id: number) => `${API_BASE}/api/shipments/${id}/status`;
const TRACKING_URL = (trackingNumber: string) =>
  `${API_BASE}/api/shipments/${encodeURIComponent(trackingNumber)}/events`;

/* ===========================
   UI helpers
=========================== */
const Badge = ({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "amber" | "gray" | "red";
}) => {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-md border ${map[color]}`}>
      {children}
    </span>
  );
};

const statusToBadge = (raw: ShipmentStatus) => {
  const s = (raw || "").toString().trim().toLowerCase();

  switch (s) {
    case "registered":
      return <Badge color="blue">Enregistré</Badge>;
    case "confirmed":
      return <Badge color="green">Confirmé</Badge>;
    case "in_transit":
    case "in-transit":
      return <Badge color="blue">En transit</Badge>;
    case "customs_clearance":
    case "customs-clearance":
      return <Badge color="amber">Douane</Badge>;
    case "delivered":
      return <Badge color="green">Livré</Badge>;
    case "cancelled":
    case "canceled":
      return <Badge color="red">Annulé</Badge>;
    case "draft":
      return <Badge>Draft</Badge>;
    default:
      const label = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "—";
      return <Badge>{label}</Badge>;
  }
};

const modeIcon = (m: Shipment["transportMode"]) => {
  if (m === "air") return "✈️";
  if (m === "sea") return "🚢";
  return "🚚";
};

/* Simple modal */
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-base font-semibold text-gray-900">{title || "Détails"}</h3>
            <button
              onClick={onClose}
              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   Page
=========================== */
export default function CalculTarif() {
  // Liste des expéditions (depuis l'API)
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filtre
  const [query, setQuery] = useState("");

  // Tracking form + résultat
  const [trackNo, setTrackNo] = useState("");
  const [events, setEvents] = useState<TrackingEvent[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);

  // Auto-refresh optionnel (désactivé par défaut)
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Modal état
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ShipmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>("confirmed");
  const [savingStatus, setSavingStatus] = useState(false);

  // Toast simple
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Fetch liste d’expéditions
  useEffect(() => {
    const ac = new AbortController();
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(LIST_URL, {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: Shipment[] = Array.isArray(data) ? data : data?.data ?? [];
        if (!Array.isArray(list)) throw new Error("Réponse API invalide");
        setShipments(list);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setErr(e?.message || "Erreur réseau");
          setShipments([]);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => ac.abort();
  }, []);

  // Auto-refresh toutes les 60s si activé
  useEffect(() => {
    if (!autoRefresh) return;
    const ac = new AbortController();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(LIST_URL, {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const list: Shipment[] = Array.isArray(data) ? data : data?.data ?? [];
          if (Array.isArray(list)) setShipments(list);
        }
      } catch {
        /* noop */
      }
    }, 60000);
    return () => {
      ac.abort();
      clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filtrage côté client
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) => {
      const inStr = (v?: string | null) => (v ?? "").toLowerCase().includes(q);
      return (
        inStr(s.trackingNumber) ||
        inStr(s.senderAddress) ||
        inStr(s.recipientAddress) ||
        inStr(s.status)
      );
    });
  }, [query, shipments]);

  // Raccourci "dernières"
  const recent = useMemo(() => {
    const parse = (d: string) => new Date(d).getTime() || 0;
    return [...shipments].sort((a, b) => parse(b.createdAt) - parse(a.createdAt)).slice(0, 3);
  }, [shipments]);

  // Recherche tracking via API
  const onSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = trackNo.trim();
    if (!t) return;
    setLoadingTrack(true);
    setNotFound(false);
    setEvents(null);
    try {
      const res = await fetch(TRACKING_URL(t), { headers: { Accept: "application/json" } });
      if (!res.ok) {
        setNotFound(true);
        setEvents(null);
        return;
      }
      const data = await res.json();
      const list: TrackingEvent[] = Array.isArray(data) ? data : data?.events ?? [];
      if (!Array.isArray(list) || list.length === 0) {
        setNotFound(true);
        setEvents(null);
        return;
      }
      setNotFound(false);
      setEvents(list);
    } catch {
      setNotFound(true);
      setEvents(null);
    } finally {
      setLoadingTrack(false);
    }
  };

  function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ---------- Handlers modal ---------- */
  const openModal = async (id: number) => {
    setSelectedId(id);
    setDetail(null);
    setDetailErr(null);
    setDetailLoading(true);
    setOpen(true);
    try {
      const res = await fetch(GET_DETAIL_URL(id), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // On tolère {data:{...}} ou {...}
      const payload: ShipmentDetail = data?.data ?? data;
      setDetail(payload);
      setNewStatus((payload.status || "confirmed") as ShipmentStatus);
    } catch (e: any) {
      setDetailErr(e?.message || "Impossible de charger l’expédition");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedId(null);
    setDetail(null);
    setDetailErr(null);
    setSavingStatus(false);
  };

  const doUpdateStatus = async () => {
    if (!selectedId) return;
    setSavingStatus(true);
    try {
      const res = await fetch(PATCH_STATUS_URL(selectedId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          status: newStatus,
          meta: { updatedBy: "dashboard" },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }

      // On ferme le modal + toast
      closeModal();
      showToast("Statut mis à jour avec succès.");

      // Mise à jour locale de la ligne (optimiste)
      setShipments((cur) =>
        cur.map((s) => (s.id === selectedId ? { ...s, status: newStatus } : s))
      );
    } catch (e: any) {
      setSavingStatus(false);
      alert(`Échec de la mise à jour: ${e?.message || "Erreur inconnue"}`);
    }
  };

  /* ===========================
     Render
  =========================== */
  return (
    <MainLayout>
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* Toast */}
        {toast && (
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tableau de bord logistique</h1>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh (60s)
            </label>
            <div className="text-xs text-gray-500">Dernière mise à jour : {new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Bandeau Dernières expéditions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {loading && !shipments.length
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-4 h-28" />
              ))
            : recent.map((s) => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{s.trackingNumber}</div>
                    {statusToBadge(s.status)}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-lg">{modeIcon(s.transportMode)}</span>
                    {s.senderAddress} → {s.recipientAddress}
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Créé : {formatDate(s.createdAt)}</span>
                    <span>ETA : {formatDate(s.enlevDate)}</span>
                  </div>
                  <button
                    className="mt-1 self-start text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => openModal(s.id)}
                  >
                    Voir
                  </button>
                </div>
              ))}
        </section>

        {/* Erreur globale */}
        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Erreur lors du chargement des expéditions : {err}
          </div>
        )}

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
                <button
                  className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                  onClick={() => {
                    const rows = [
                      ["trackingNumber", "senderAddress", "recipientAddress", "status", "transportMode", "createdAt", "eta"],
                      ...filtered.map((s) => [
                        s.trackingNumber,
                        s.senderAddress,
                        s.recipientAddress,
                        s.status,
                        s.transportMode,
                        s.createdAt,
                        s.enlevDate ?? "",
                      ]),
                    ];
                    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "shipments.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
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
                  {loading && !shipments.length ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-3" colSpan={7}>
                          <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-gray-900">{s.trackingNumber}</td>
                        <td className="px-4 py-3">{s.senderAddress}</td>
                        <td className="px-4 py-3">{s.recipientAddress}</td>
                        <td className="px-4 py-3">
                          {modeIcon(s.transportMode)} <span className="ml-1 uppercase text-xs">{s.transportMode}</span>
                        </td>
                        <td className="px-4 py-3">{statusToBadge(s.status)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(s.createdAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                            onClick={() => openModal(s.id)}
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
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
                disabled={loadingTrack}
              >
                {loadingTrack ? "Recherche..." : "Rechercher"}
              </button>
            </form>

            <div className="mt-4 h-56 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
              Carte / Trajet (intégration Map à brancher)
            </div>

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

      {/* -------- Modal Voir + Update statut -------- */}
      <Modal open={open} onClose={closeModal} title={detail ? `Expédition ${detail.trackingNumber}` : "Détails"}>
        {detailLoading && <div className="text-sm text-gray-600">Chargement…</div>}
        {detailErr && <div className="text-sm text-red-600">{detailErr}</div>}
        {!detailLoading && !detailErr && detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">Origine</div>
                <div className="text-sm font-medium text-gray-900">{detail.senderAddress}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Destination</div>
                <div className="text-sm font-medium text-gray-900">{detail.recipientAddress}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Statut actuel</div>
                <div className="mt-1">{statusToBadge(detail.status)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Créé le</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(detail.createdAt)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">Expéditeur</div>
                <div className="text-sm text-gray-800">{detail.senderName} • {detail.senderPhone}</div>
                <div className="text-xs text-gray-500">{detail.senderEmail}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Destinataire</div>
                <div className="text-sm text-gray-800">{detail.recipientName} • {detail.recipientPhone}</div>
                <div className="text-xs text-gray-500">{detail.recipientEmail}</div>
              </div>
            </div>

            <div className="text-sm">
              <div className="text-xs text-gray-500">Description</div>
              <div className="text-gray-800">{detail.description || "—"}</div>
            </div>

            <div className="border-t pt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Nouveau statut</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="registered">Enregistré</option>
                <option value="confirmed">Confirmé</option>
                <option value="in_transit">En transit</option>
                <option value="customs_clearance">Douane</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
                <option value="draft">Draft</option>
              </select>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={closeModal}
                  disabled={savingStatus}
                >
                  Annuler
                </button>
                <button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={doUpdateStatus}
                  disabled={savingStatus}
                >
                  {savingStatus ? "Mise à jour…" : "Mettre à jour"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
