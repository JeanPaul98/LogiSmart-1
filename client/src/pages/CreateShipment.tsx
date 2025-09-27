// src/pages/CreateShipment.tsx
import MainLayout from "@/components/layout/MainLayout";
import React, { useMemo, useState } from "react";

/* ===========================
   Types (inchangés)
=========================== */
type Party = {
  contact: string;
  email: string;
  phone: string;
  address: string;
  cityZip: string;
  country: string;
  ref?: string;
  notes?: string;
};

type ShipmentDetails = {
  transportMode: "Aérien" | "Maritime" | "Routier" | "" | "Aérien / Maritime / Routier";
  incoterm: "EXW" | "FOB" | "CIF" | "DDP" | "" | "EXW / FOB / CIF / DDP";
  flow: "Exportation" | "Importation" | "Exportation / Importation";
  pickupDate: string;
  insurance: "Oui" | "Non" | "Oui / Non";
  payment: "Prépayé" | "Collecte" | "Prépayé / Collecte";
  pickupPlace: string;
  deliveryPlace: string;
  clientRef?: string;
  remarks?: string;
  docsProvided?: string;
  docsMissing?: string;
  licenses?: "Oui" | "Non" | "Oui / Non";
  inspection?: "Oui" | "Non" | "Oui / Non";
};

type ParcelLine = {
  qty: number;
  designation: string;
  weightKg: number;
  valueUsd: number;
  codeHs: string;
};

type ParcelsBlock = {
  count: string;
  totalWeight: string;
  dimensions: string;
  declaredValue: string;
  mainHs: string;
  description: string;
  dangerous: "Oui" | "Non" | "Oui / Non";
  dangerousDetails?: string;
  requiredDocs?: string;
  internalNotes?: string;
  lines: ParcelLine[];
};

type ServicesBlock = {
  serviceMode: "Express" | "Économique" | "Fret" | "";
  insuranceDeclared: boolean;
  customsIncluded: boolean;
  delivery: "Domicile" | "Point relais" | "À domicile / Point relais" | "";
  pickupSchedule: string;
  packagingPro: boolean;
  notifyEmailSms: boolean;
  options: { pod: boolean; signature: boolean; priority: boolean };
  estimate: {
    transport: number; transportUnit: "USD"; transportTax: "HT" | "TTC";
    customs: number; customsUnit: "USD"; customsTax: "HT" | "TTC";
    insurance: number; insuranceUnit: "USD"; insuranceTax: "HT" | "TTC";
    taxes: number; taxesUnit: "USD"; taxesTax: "HT" | "TTC";
  };
  paymentMethod: "Carte" | "Virement" | "Compte" | "Carte / Virement / Compte";
  carrierNotes?: string;
  clientRef?: string;
  acceptTerms: boolean;
};

/* ===========================
   UI Helpers
=========================== */
type SectionProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};
const Section = ({ title, subtitle, right, className, children }: SectionProps) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-5 ${className || ""}`}>
    <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 truncate">{title}</h3>
        {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </div>
);

type LabelProps = { htmlFor?: string; children?: React.ReactNode };
const Label = ({ htmlFor, children }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-[12px] font-medium text-gray-600 mb-1">
    {children}
  </label>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { children?: React.ReactNode };
const Input = (props: InputProps) => (
  <input
    {...props}
    inputMode={props.type === "number" ? "decimal" : props.inputMode}
    className={
      "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] placeholder:text-gray-400 " +
      (props.className || "")
    }
  />
);

type FieldProps = { label: string; id?: string; children?: React.ReactNode };
const Field = ({ label, id, children }: FieldProps) => (
  <div className="min-w-0">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

const StepPill = ({ index, title, active, done }: { index: number; title: string; active?: boolean; done?: boolean }) => (
  <div
    className={
      "flex items-center gap-2 px-3 py-2 rounded-lg border shrink-0 " +
      (active
        ? "bg-blue-50 border-blue-200 text-blue-700"
        : done
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-white border-gray-200 text-gray-600")
    }
  >
    <span
      className={
        "h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold " +
        (active ? "bg-blue-600 text-white" : done ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700")
      }
    >
      {index}
    </span>
    <span className="text-[13px] font-medium whitespace-nowrap">{title}</span>
  </div>
);

const clampStep = (n: number): 1 | 2 | 3 | 4 => {
  const v = Math.max(1, Math.min(4, n));
  return v as 1 | 2 | 3 | 4;
};

/* ===========================
   API config & helpers
=========================== */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

const getAccessToken = () => localStorage.getItem("access_token");

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${msg}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

/* ===========================
   Main
=========================== */
export default function CreateShipment() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [sender, setSender] = useState<Party>({
    contact: "",
    email: "expediteur@example.com",
    phone: "+221 77 000 00 00",
    address: "Rue, numéro, complément",
    cityZip: "Dakar • 11000",
    country: "Sénégal",
    ref: "REF-EXP-001",
  });

  const [receiver, setReceiver] = useState<Party>({
    contact: "",
    email: "destinataire@example.com",
    phone: "+225 07 000 00 00",
    address: "Rue, numéro, complément",
    cityZip: "Abidjan • 00225",
    country: "Côte d'Ivoire",
    notes: "Ex: Point relais, horaires…",
  });

  const [details, setDetails] = useState<ShipmentDetails>({
    transportMode: "Aérien / Maritime / Routier",
    incoterm: "EXW / FOB / CIF / DDP",
    flow: "Exportation / Importation",
    pickupDate: "",
    insurance: "Oui / Non",
    payment: "Prépayé / Collecte",
    pickupPlace: "",
    deliveryPlace: "",
    clientRef: "Ex: REF-INV-2025-001",
    remarks: "",
    docsProvided: "Facture / Liste de colisage / Certificat d'origine",
    docsMissing: "—",
    licenses: "Oui / Non",
    inspection: "Oui / Non",
  });

  const [parcels, setParcels] = useState<ParcelsBlock>({
    count: "Ex: 3",
    totalWeight: "Ex: 25 kg",
    dimensions: "Ex: 40 × 30 × 25 cm",
    declaredValue: "Ex: 1 200 USD",
    mainHs: "Ex: 8471.30",
    description: "Ex: Ordinateurs portables",
    dangerous: "Oui / Non",
    dangerousDetails: "",
    requiredDocs: "Facture, Liste de colisage, Certificat d'origine",
    internalNotes: "Ex: Emballer avec mousse supplémentaire",
    lines: [
      { qty: 10, designation: 'Laptop 14"', weightKg: 1.5, valueUsd: 120, codeHs: "8471.30" },
      { qty: 5, designation: "Dock USB-C", weightKg: 0.4, valueUsd: 45, codeHs: "8471.80" },
    ],
  });

  const [services, setServices] = useState<ServicesBlock>({
    serviceMode: "",
    insuranceDeclared: true,
    customsIncluded: true,
    delivery: "À domicile / Point relais",
    pickupSchedule: "",
    packagingPro: false,
    notifyEmailSms: true,
    options: { pod: true, signature: false, priority: false },
    estimate: {
      transport: 1050, transportUnit: "USD", transportTax: "HT",
      customs: 120, customsUnit: "USD", customsTax: "HT",
      insurance: 12, insuranceUnit: "USD", insuranceTax: "HT",
      taxes: 85, taxesUnit: "USD", taxesTax: "TTC",
    },
    paymentMethod: "Carte / Virement / Compte",
    carrierNotes: "",
    clientRef: "PO-4589 / Projet Alpha",
    acceptTerms: false,
  });

  const totals = useMemo(() => {
    const ht = (services.estimate.transport || 0) + (services.estimate.customs || 0) + (services.estimate.insurance || 0);
    const ttc = ht + (services.estimate.taxes || 0);
    return { ht, ttc, delay: "3–5 j ouvrés" };
  }, [services]);

  const next = () => setStep((prev) => clampStep(prev + 1));
  const back = () => setStep((prev) => clampStep(prev - 1));

  const saveDraft = () => {
    alert("Brouillon enregistré (mock).");
  };

  /* ===========================
     Documents (Step 3)
  ============================ */
  type LocalDoc = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    serverId?: string;   // id retourné par /api/upload
    url?: string;        // URL retournée
    status: "local" | "temporary";
  };
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<string[]>([]);
  const [finalizing, setFinalizing] = useState(false);

  const ACCEPTED = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const formatBytes = (n: number) => {
    if (!isFinite(n)) return "—";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(1)} ${u[i]}`;
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: LocalDoc[] = [];
    Array.from(list).forEach((f) => {
      if (f.size > MAX_SIZE) return;
      if (!ACCEPTED.includes(f.type)) return;
      next.push({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        status: "local",
      });
    });
    if (next.length === 0) { alert("Merci de renseigner les champs"); return; }
    setDocs((cur) => [...cur, ...next]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);

  const removeDoc = (id: string) => setDocs((cur) => cur.filter((d) => d.id !== id));

  // Upload temporaire réel (multipart/form-data) vers POST /api/upload
  type UploadedDoc = { id: number; url: string; filename: string; type: string };
  const markAsTemporary = async (localId: string) => {
    const doc = docs.find(d => d.id === localId);
    if (!doc) return;
    if (uploadingIds.includes(localId)) return;

    setUploadingIds(prev => [...prev, localId]);
    try {
      const fd = new FormData();
      fd.append("file", doc.file, doc.name);
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${msg}`);
      }
      const data: UploadedDoc = await res.json();
      setDocs(cur =>
        cur.map(d =>
          d.id === localId ? { ...d, status: "temporary", serverId: String(data.id), url: data.url } : d
        )
      );
    } catch (e: any) {
      alert(e?.message || "Échec de l’upload temporaire");
    } finally {
      setUploadingIds(prev => prev.filter(id => id !== localId));
    }
  };

  /* ===========================
     Finalisation (Step 4)
  ============================ */
  const finalize = async () => {
    const documentIds = docs
      .filter(d => d.status === "temporary" && d.serverId)
      .map(d => Number(d.serverId));

    try {
      setFinalizing(true);

      const totalCost =
        (services.estimate.transport || 0) +
        (services.estimate.customs || 0) +
        (services.estimate.insurance || 0) +
        (services.estimate.taxes || 0);

      const weight = Number(String(parcels.totalWeight).replace(/[^\d.]/g, "")) || 0;
      const value = Number(String(parcels.declaredValue).replace(/[^\d.]/g, "")) || 0;
      const nbColis = Number(String(parcels.count).replace(/[^\d]/g, "")) || 1;

      const payload = {
        userId: "f483632c-4a94-4636-8db3-3db24afb9709", // TODO: remplacer par l’utilisateur connecté
        senderName: sender.contact,
        senderEmail: sender.email,
        senderAddress: `${sender.address}, ${sender.cityZip}`,
        senderPhone: sender.phone,

        recipientName: receiver.contact,
        recipientEmail: receiver.email,
        recipientAddress: `${receiver.address}, ${receiver.cityZip}`,
        recipientPhone: receiver.phone,

        description: parcels.description,
        sensTransi: details.flow.startsWith("Export") ? "Export" : "Import",
        weight,
        volume: 0.0, // si tu as le volume exact, remplace-le ici
        value,
        nbColis,
        hsCode: parcels.mainHs,
        enlevDate: details.pickupDate ? new Date(details.pickupDate).toISOString() : null,

        transportMode:
          details.transportMode.includes("Aérien") ? "road" /* ou "air" selon ton backend */ :
          details.transportMode.includes("Maritime") ? "sea" : "road",

        originCity: sender.cityZip.split("•")[0]?.trim() || sender.country,
        destinationCity: receiver.cityZip.split("•")[0]?.trim() || receiver.country,
        status,

        totalCost,
        customsDuty: services.estimate.customs || 0,
        vat: 0, // si calculée côté UI, mets la vraie valeur

        documentIds, // IDs renvoyés par /api/upload
      };

      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/shipments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${msg}`);
      }
      const created = await res.json();
      alert("Envoi finalisé ✅");

      // Option : reset partiel
      // setDocs([]);
      // setStep(1);
    } catch (e: any) {
      alert(e?.message || "Échec de la finalisation");
    } finally {
      setFinalizing(false);
    }
  };

  /* ===========================
     UI helpers step 4
  ============================ */
  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
      {children}
    </span>
  );
  const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || "—"}</span>
    </div>
  );
  const DocBadge = ({ status }: { status: "local" | "temporary" }) => (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border ${
        status === "temporary"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {status === "temporary" ? "Temporaire" : "Local"}
    </span>
  );
  const isImg = (m: string) => m.startsWith("image/");
  const isPdf = (m: string) => m.includes("pdf");

  /* ===========================
     RENDER
  ============================ */
  return (
    <MainLayout>
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Créer un nouvel envoi</h1>

        {/* Stepper */}
        <div className="mt-4 flex items-center gap-3 overflow-x-auto no-scrollbar pr-1">
          <StepPill index={1} title="Expéditeur & Destinataire" active={step === 1} done={step > 1} />
          <StepPill index={2} title="Détails d’envoi & Marchandises" active={step === 2} done={step > 2} />
          <StepPill index={3} title="Document requis" active={step === 3} done={step > 3} />
          <StepPill index={4} title="Services & Résumé" active={step === 4} />
          <div className="ml-auto text-xs text-gray-500 shrink-0">Étape {step} sur 4</div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 grid grid-cols-1 gap-5">
          {step === 1 && (
            <Section title="Informations expéditeur">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nom & Prénom">
                  <Input value={sender.contact} onChange={(e) => setSender({ ...sender, contact: e.target.value })} placeholder="Nom & Prénom" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={sender.email} onChange={(e) => setSender({ ...sender, email: e.target.value })} />
                </Field>
                <Field label="Téléphone">
                  <Input value={sender.phone} onChange={(e) => setSender({ ...sender, phone: e.target.value })} placeholder="+221 77 000 00 00" />
                </Field>
                <Field label="Adresse">
                  <Input value={sender.address} onChange={(e) => setSender({ ...sender, address: e.target.value })} />
                </Field>
                <Field label="Ville / Code postal">
                  <Input value={sender.cityZip} onChange={(e) => setSender({ ...sender, cityZip: e.target.value })} placeholder="Dakar • 11000" />
                </Field>
                <Field label="Pays">
                  <Input value={sender.country} onChange={(e) => setSender({ ...sender, country: e.target.value })} />
                </Field>
              </div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Informations destinataire">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nom & Prénom">
                  <Input value={receiver.contact} onChange={(e) => setReceiver({ ...receiver, contact: e.target.value })} placeholder="Nom & Prénom" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={receiver.email} onChange={(e) => setReceiver({ ...receiver, email: e.target.value })} />
                </Field>
                <Field label="Téléphone">
                  <Input value={receiver.phone} onChange={(e) => setReceiver({ ...receiver, phone: e.target.value })} placeholder="+225 07 000 00 00" />
                </Field>
                <Field label="Adresse">
                  <Input value={receiver.address} onChange={(e) => setReceiver({ ...receiver, address: e.target.value })} />
                </Field>
                <Field label="Ville / Code postal">
                  <Input value={receiver.cityZip} onChange={(e) => setReceiver({ ...receiver, cityZip: e.target.value })} placeholder="Abidjan • 00225" />
                </Field>
                <Field label="Pays">
                  <Input value={receiver.country} onChange={(e) => setReceiver({ ...receiver, country: e.target.value })} />
                </Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Détails de l’envoi">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Mode de transport">
                  <Input value={details.transportMode} onChange={(e) => setDetails({ ...details, transportMode: e.target.value as any })} />
                </Field>
                <Field label="Sens">
                  <Input value={details.flow} onChange={(e) => setDetails({ ...details, flow: e.target.value as any })} />
                </Field>
                <Field label="Date d’enlèvement souhaitée">
                  <Input placeholder="JJ/MM/AAAA" value={details.pickupDate} onChange={(e) => setDetails({ ...details, pickupDate: e.target.value })} />
                </Field>
                <Field label="Assurance transport">
                  <Input value={details.insurance} onChange={(e) => setDetails({ ...details, insurance: e.target.value as any })} />
                </Field>
                <Field label="Lieu d’enlèvement">
                  <Input placeholder="Ville, pays" value={details.pickupPlace} onChange={(e) => setDetails({ ...details, pickupPlace: e.target.value })} />
                </Field>
                <Field label="Lieu de livraison">
                  <Input placeholder="Ville, pays" value={details.deliveryPlace} onChange={(e) => setDetails({ ...details, deliveryPlace: e.target.value })} />
                </Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Colis & Marchandises">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Field label="Description des marchandises">
                  <Input value={parcels.description} onChange={(e) => setParcels({ ...parcels, description: e.target.value })} />
                </Field>
                <Field label="Nombre de colis">
                  <Input value={parcels.count} onChange={(e) => setParcels({ ...parcels, count: e.target.value })} />
                </Field>
                <Field label="Poids total">
                  <Input value={parcels.totalWeight} onChange={(e) => setParcels({ ...parcels, totalWeight: e.target.value })} />
                </Field>
                <Field label="Dimensions (L × l × h)">
                  <Input value={parcels.dimensions} onChange={(e) => setParcels({ ...parcels, dimensions: e.target.value })} />
                </Field>
                <Field label="Valeur déclarée">
                  <Input value={parcels.declaredValue} onChange={(e) => setParcels({ ...parcels, declaredValue: e.target.value })} />
                </Field>
                <Field label="Code SH principal">
                  <Input value={parcels.mainHs} onChange={(e) => setParcels({ ...parcels, mainHs: e.target.value })} />
                </Field>
                <Field label="Matières dangereuses">
                  <Input value={parcels.dangerous} onChange={(e) => setParcels({ ...parcels, dangerous: e.target.value as any })} />
                </Field>
                <Field label="">
                  <div className="text-xs text-gray-500">Besoin d’aide ? Utilisez la recherche de codes SH.</div>
                </Field>
              </div>
            </Section>
          )}

          {/* STEP 3 : Upload temporaire */}
          {step === 3 && (
            <Section
              title="Soumission des documents"
              subtitle="Téléverse des documents provisoires puis lie-les à l’envoi lors de la finalisation."
            >
              {/* Zone Drag & Drop */}
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={[
                  "rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition",
                  dragActive ? "border-blue-400 bg-blue-50/50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                ].join(" ")}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 0 0 4 4h10a4 4 0 1 0 0-8h-1M8 11l4-4m0 0 4 4m-4-4v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  Glisse-dépose ici, ou{" "}
                  <label className="font-medium text-blue-600 underline cursor-pointer">
                    clique pour parcourir
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </label>
                  .
                </p>
                <p className="mt-1 text-xs text-gray-500">PDF, JPG/PNG, DOC/DOCX • 10MB max/fichier</p>
              </div>

              {/* Info temporaire */}
              <div className="mt-4 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                Les documents ajoutés ici sont <span className="font-semibold">temporaires</span>. Lors de la finalisation (étape 4),
                ils seront <span className="font-semibold">liés à l’envoi</span>.
              </div>

              {/* Grille des documents */}
              <div className="mt-5">
                {docs.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
                    Aucun fichier ajouté pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs.map((d) => {
                      const _isImg = isImg(d.type);
                      const _isPdf = isPdf(d.type);
                      const uploading = uploadingIds.includes(d.id);
                      return (
                        <div key={d.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                          {/* Preview */}
                          <div className="h-32 bg-gray-50 flex items-center justify-center relative">
                            <span className="absolute top-2 left-2">
                              <DocBadge status={d.status} />
                            </span>

                            {_isImg ? (
                              <img
                                src={URL.createObjectURL(d.file)}
                                alt={d.name}
                                className="h-full w-full object-cover"
                                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                              />
                            ) : _isPdf ? (
                              <div className="flex flex-col items-center">
                                <span className="text-red-500 font-semibold">PDF</span>
                                <span className="text-[10px] text-gray-500 mt-1">Aperçu indisponible</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-blue-500 font-semibold">DOC</span>
                                <span className="text-[10px] text-gray-500 mt-1">Aperçu indisponible</span>
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-900 truncate" title={d.name}>
                              {d.name}
                            </div>
                            <div className="text-xs text-gray-500">{formatBytes(d.size)}</div>

                            {d.url && (
                              <div className="mt-1 text-xs">
                                <a className="text-blue-600 underline" href={d.url} target="_blank" rel="noreferrer">
                                  Ouvrir le document
                                </a>
                              </div>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {_isImg ? (
                                  <button
                                    type="button"
                                    className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-50"
                                    onClick={() => {
                                      const url = URL.createObjectURL(d.file);
                                      window.open(url, "_blank");
                                    }}
                                  >
                                    Aperçu
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-gray-500">—</span>
                                )}

                                {d.status === "local" && (
                                  <button
                                    type="button"
                                    className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-50 text-emerald-700 disabled:opacity-60"
                                    onClick={() => markAsTemporary(d.id)}
                                    disabled={uploading}
                                    title="Uploader ce fichier en temporaire sur le serveur"
                                  >
                                    {uploading ? "Envoi..." : "Marquer temporaire"}
                                  </button>
                                )}
                              </div>

                              <button
                                type="button"
                                className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-50 text-red-600"
                                onClick={() => removeDoc(d.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600">
                À la validation de l’envoi (étape 4), seuls les documents <span className="font-medium">temporaires</span> seront rattachés.
              </div>
            </Section>
          )}

          {/* STEP 4 : Résumé + Finalisation */}
          {step === 4 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2 space-y-5">
                <Section
                  title="Résumé de l'expédition"
                  subtitle="Vérifie les informations essentielles avant la finalisation."
                  right={
                    <div className="flex flex-wrap gap-2">
                      <Chip>Colis : {parcels.count.replace("Ex:","").trim() || "—"}</Chip>
                      <Chip>Poids : {parcels.totalWeight.replace("Ex:","").trim() || "—"}</Chip>
                      <Chip>Valeur : {parcels.declaredValue.replace("Ex:","").trim() || "—"}</Chip>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">Expéditeur</h4>
                        <Chip>Origine</Chip>
                      </div>
                      <Row label="Nom"   value={sender.contact || "—"} />
                      <Row label="Email" value={sender.email || "—"} />
                      <Row label="Tél."  value={sender.phone || "—"} />
                      <Row label="Adresse" value={sender.address || "—"} />
                      <Row label="Ville/CP" value={sender.cityZip || "—"} />
                      <Row label="Pays"  value={sender.country || "—"} />
                    </div>

                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">Destinataire</h4>
                        <Chip>Destination</Chip>
                      </div>
                      <Row label="Nom"   value={receiver.contact || "—"} />
                      <Row label="Email" value={receiver.email || "—"} />
                      <Row label="Tél."  value={receiver.phone || "—"} />
                      <Row label="Adresse" value={receiver.address || "—"} />
                      <Row label="Ville/CP" value={receiver.cityZip || "—"} />
                      <Row label="Pays"  value={receiver.country || "—"} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">Détails d’envoi</h4>
                        <div className="flex gap-2">
                          <Chip>{details.transportMode}</Chip>
                          <Chip>{details.flow}</Chip>
                        </div>
                      </div>
                      <Row label="Incoterm" value={details.incoterm} />
                      <Row label="Assurance" value={details.insurance} />
                      <Row label="Paiement" value={details.payment} />
                      <Row label="Enlèvement" value={details.pickupPlace || "—"} />
                      <Row label="Livraison" value={details.deliveryPlace || "—"} />
                      <Row label="Date d’enlèvement" value={details.pickupDate || "—"} />
                      <Row label="Réf. Client" value={details.clientRef || "—"} />
                    </div>

                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">Marchandises</h4>
                        <Chip>{parcels.dangerous}</Chip>
                      </div>
                      <Row label="Description" value={parcels.description || "—"} />
                      <Row label="Nb colis" value={parcels.count || "—"} />
                      <Row label="Poids total" value={parcels.totalWeight || "—"} />
                      <Row label="Dimensions" value={parcels.dimensions || "—"} />
                      <Row label="Valeur déclarée" value={parcels.declaredValue || "—"} />
                      <Row label="Code SH" value={parcels.mainHs || "—"} />
                    </div>
                  </div>
                </Section>

                {/* Documents soumis */}
                <Section title="Documents soumis" subtitle="Aperçu des fichiers ajoutés à l’étape précédente.">
                  {docs.length === 0 ? (
                    <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
                      Aucun document ajouté.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {docs.map((d) => (
                        <div key={d.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                          <div className="h-32 bg-gray-50 flex items-center justify-center relative">
                            <span className="absolute top-2 left-2">
                              <DocBadge status={d.status} />
                            </span>
                            {isImg(d.type) ? (
                              <img
                                src={URL.createObjectURL(d.file)}
                                alt={d.name}
                                className="h-full w-full object-cover"
                                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                              />
                            ) : isPdf(d.type) ? (
                              <div className="flex flex-col items-center">
                                <span className="text-red-500 font-semibold">PDF</span>
                                <span className="text-[10px] text-gray-500 mt-1">Aperçu indisponible</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-blue-500 font-semibold">DOC</span>
                                <span className="text-[10px] text-gray-500 mt-1">Aperçu indisponible</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-900 truncate" title={d.name}>
                              {d.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(d.file.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2">
                              {isImg(d.type) ? (
                                <button
                                  type="button"
                                  className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-50"
                                  onClick={() => {
                                    const url = URL.createObjectURL(d.file);
                                    window.open(url, "_blank");
                                  }}
                                >
                                  Aperçu
                                </button>
                              ) : (
                                <span className="text-[11px] text-gray-500">—</span>
                              )}
                              {d.url ? (
                                <a
                                  className="px-3 py-1 text-xs rounded border bg-white hover:bg-gray-50 text-blue-700"
                                  href={d.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Ouvrir
                                </a>
                              ) : (
                                <span className="text-[11px] text-gray-400">Pas d’URL</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </div>

              {/* Colonne droite : devis / coûts / finalisation */}
              <div className="space-y-5">
                <Section title="Devis estimatif" subtitle="Récapitulatif des montants">
                  <div className="divide-y">
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transport</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {services.estimate.transport} {services.estimate.transportUnit} <span className="text-xs text-gray-500">({services.estimate.transportTax})</span>
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dédouanement</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {services.estimate.customs} {services.estimate.customsUnit} <span className="text-xs text-gray-500">({services.estimate.customsTax})</span>
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Assurance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {services.estimate.insurance} {services.estimate.insuranceUnit} <span className="text-xs text-gray-500">({services.estimate.insuranceTax})</span>
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxes & droits</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {services.estimate.taxes} {services.estimate.taxesUnit} <span className="text-xs text-gray-500">({services.estimate.taxesTax})</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">Total HT</div>
                      <div className="text-lg font-bold text-gray-900">{totals.ht} USD</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">TTC estimé</div>
                      <div className="text-lg font-bold text-gray-900">{totals.ttc} USD</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <span className="font-medium">Délai estimé :</span> {totals.delay}
                  </div>
                </Section>

                <Section title="Validation">
{  /*               <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">CGV & politique douanière</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${services.acceptTerms ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {services.acceptTerms ? "Acceptées" : "Non acceptées"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Méthode de paiement</span>
                      <span className="font-medium text-gray-900">{services.paymentMethod}</span>
                    </div>
                  </div>       */}

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      onClick={() => setStep(3)}
                    >
                      Revenir aux documents
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                      onClick={finalize}
                      disabled={finalizing}
                    >
                      {finalizing ? "Finalisation..." : "Finaliser l’envoi"}
                    </button>
                  </div>
                </Section>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-gray-600 bg-gray-100 border border-gray-200"
          >
            Enregistrer comme brouillon
          </button>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Retour
              </button>
            ) : (
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                disabled
              >
                Retour
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={finalize}
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                disabled={finalizing}
              >
                {finalizing ? "Finalisation..." : "Finaliser l’envoi"}
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
