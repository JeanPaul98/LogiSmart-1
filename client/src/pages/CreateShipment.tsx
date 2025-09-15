import MainLayout from "@/components/layout/MainLayout";
import React, { useMemo, useState } from "react";

// -----------------------------
// Types
// -----------------------------
type Party = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  cityZip: string;
  country: string;
  ref?: string;
  notes?: string; // livraison
};

type ShipmentDetails = {
  transportMode: "Aérien" | "Maritime" | "Routier" | "" | "Aérien / Maritime / Routier";
  incoterm: "EXW" | "FOB" | "CIF" | "DDP" | "" | "EXW / FOB / CIF / DDP";
  flow: "Exportation" | "Importation" | "Exportation / Importation";
  pickupDate: string; // JJ/MM/AAAA
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
  count: string; // “Ex: 3”
  totalWeight: string; // “Ex: 25 kg”
  dimensions: string; // “L x l x h”
  declaredValue: string; // “1 200 USD”
  mainHs: string; // “8471.30”
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
  pickupSchedule: string; // texte libre
  packagingPro: boolean;
  notifyEmailSms: boolean;
  options: {
    pod: boolean;
    signature: boolean;
    priority: boolean;
  };
  estimate: {
    transport: number;
    transportUnit: "USD";
    transportTax: "HT" | "TTC";
    customs: number;
    customsUnit: "USD";
    customsTax: "HT" | "TTC";
    insurance: number;
    insuranceUnit: "USD";
    insuranceTax: "HT" | "TTC";
    taxes: number;
    taxesUnit: "USD";
    taxesTax: "HT" | "TTC";
  };
  paymentMethod: "Carte" | "Virement" | "Compte" | "Carte / Virement / Compte";
  carrierNotes?: string;
  clientRef?: string;
  acceptTerms: boolean;
};

// -----------------------------
// Helpers
// -----------------------------
type SectionProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

const Section = ({ title, subtitle, right, className, children }: SectionProps) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className || ""}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
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
    className={
      "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] " +
      (props.className || "")
    }
  />
);

type FieldProps = { label: string; id?: string; children?: React.ReactNode };
const Field = ({ label, id, children }: FieldProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

type StepPillProps = { index: number; title: string; active?: boolean; done?: boolean; children?: React.ReactNode };
const StepPill = ({ index, title, active, done }: StepPillProps) => (
  <div
    className={
      "flex items-center gap-2 px-3 py-2 rounded-lg border " +
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
    <span className="text-[13px] font-medium">{title}</span>
  </div>
);

// clamp qui renvoie exactement 1|2|3|4
const clampStep = (n: number): 1 | 2 | 3 | 4 => {
  const v = Math.max(1, Math.min(4, n));
  return (v as 1 | 2 | 3 | 4);
};

// -----------------------------
// Main
// -----------------------------
export default function CreateShipment() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [sender, setSender] = useState<Party>({
    company: "Entreprise A",
    contact: "",
    email: "expediteur@example.com",
    phone: "+221 77 000 00 00",
    address: "Rue, numéro, complément",
    cityZip: "Dakar • 11000",
    country: "Sénégal",
    ref: "REF-EXP-001",
  });

  const [receiver, setReceiver] = useState<Party>({
    company: "Entreprise B",
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
      transport: 1050,
      transportUnit: "USD",
      transportTax: "HT",
      customs: 120,
      customsUnit: "USD",
      customsTax: "HT",
      insurance: 12,
      insuranceUnit: "USD",
      insuranceTax: "HT",
      taxes: 85,
      taxesUnit: "USD",
      taxesTax: "TTC",
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

  const finalize = () => {
    if (!services.acceptTerms) {
      alert("Veuillez accepter les CGV et la politique douanière.");
      return;
    }
    alert("Envoi finalisé (mock).");
  };

  const RecapCompact = () => (
    <div className="text-right bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-sm text-gray-500">Expéditeur</div>
      <div className="font-semibold text-gray-900">{sender.company}, {sender.cityZip.split("•")[0]}</div>
      <div className="mt-3 text-sm text-gray-500">Destinataire</div>
      <div className="font-semibold text-gray-900">{receiver.company}, {receiver.cityZip.split("•")[0]}</div>
      <div className="border-t my-4" />
      <div className="space-y-1 text-sm">
        <div><span className="text-gray-500">Colis </span><span className="font-semibold">{parcels.count.replace("Ex:","").trim() || "3"}</span></div>
        <div><span className="text-gray-500">Poids </span><span className="font-semibold">{parcels.totalWeight.replace("Ex:","").trim() || "25 kg"}</span></div>
        <div><span className="text-gray-500">Dim. </span><span className="font-semibold">{parcels.dimensions.replace("Ex:","").trim() || "40×30×25 cm"}</span></div>
        <div><span className="text-gray-500">Valeur déclarée </span><span className="font-semibold">{parcels.declaredValue.replace("Ex:","").trim() || "1 200 USD"}</span></div>
        <div><span className="text-gray-500">Code SH </span><span className="font-semibold">{parcels.mainHs.replace("Ex:","").trim() || "8471.30"}</span></div>
      </div>
    </div>
  );

  return (

    <MainLayout>
      {/*<main className="max-w-6xl mx-auto px-4 py-6">*/}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Créer un nouvel envoi</h1>
        {/* Stepper */}
        <div className="mt-4 flex flex-wrap gap-3">
          <StepPill index={1} title="Expéditeur & Destinataire" active={step === 1} done={step > 1} />
          <StepPill index={2} title="Détails d’envoi" active={step === 2} done={step > 2} />
          <StepPill index={3} title="Colis & Marchandises" active={step === 3} done={step > 3} />
          <StepPill index={4} title="Services & Résumé" active={step === 4} />
          <div className="ml-auto text-xs text-gray-500">Étape {step} sur 4</div>
        </div>
        {/* CONTENT */}
        <div className="mt-5 grid grid-cols-1 gap-5">
          {step === 1 && (
            <Section title="Informations expéditeur">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom / Entreprise">
                  <Input value={sender.company} onChange={(e) => setSender({ ...sender, company: e.target.value })} />
                </Field>
                <Field label="Contact">
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
                <Field label="Référence client (optionnel)">
                  <Input value={sender.ref || ""} onChange={(e) => setSender({ ...sender, ref: e.target.value })} placeholder="REF-EXP-001" />
                </Field>
              </div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Informations destinataire">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom / Entreprise">
                  <Input value={receiver.company} onChange={(e) => setReceiver({ ...receiver, company: e.target.value })} />
                </Field>
                <Field label="Contact">
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
                <Field label="Instructions de livraison (optionnel)">
                  <Input value={receiver.notes || ""} onChange={(e) => setReceiver({ ...receiver, notes: e.target.value })} placeholder="Ex: Point relais, horaires…" />
                </Field>
              </div>

              {/* Récap rapide */}
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-pink-100 overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-semibold text-pink-700">A</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{sender.company || "—"}</div>
                        <div className="text-xs text-gray-500">{sender.cityZip || sender.country}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">B</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{receiver.company || "—"}</div>
                        <div className="text-xs text-gray-500">{receiver.cityZip || receiver.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Détails de l’envoi">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Mode de transport">
                  <Input value={details.transportMode} onChange={(e) => setDetails({ ...details, transportMode: e.target.value as any })} />
                </Field>
                <Field label="Incoterm">
                  <Input value={details.incoterm} onChange={(e) => setDetails({ ...details, incoterm: e.target.value as any })} />
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
                <Field label="Type de paiement">
                  <Input value={details.payment} onChange={(e) => setDetails({ ...details, payment: e.target.value as any })} />
                </Field>

                <Field label="Lieu d’enlèvement">
                  <Input placeholder="Ville, pays" value={details.pickupPlace} onChange={(e) => setDetails({ ...details, pickupPlace: e.target.value })} />
                </Field>
                <Field label="Lieu de livraison">
                  <Input placeholder="Ville, pays" value={details.deliveryPlace} onChange={(e) => setDetails({ ...details, deliveryPlace: e.target.value })} />
                </Field>
                <Field label="Référence client (optionnel)">
                  <Input value={details.clientRef} onChange={(e) => setDetails({ ...details, clientRef: e.target.value })} />
                </Field>

                <Field label="Remarques" >
                  <Input placeholder="Ex: Enlèvement en journée uniquement" value={details.remarks} onChange={(e) => setDetails({ ...details, remarks: e.target.value })} />
                </Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Documents & conformité">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Documents fournis">
                  <Input value={details.docsProvided} onChange={(e) => setDetails({ ...details, docsProvided: e.target.value })} />
                </Field>
                <Field label="Documents manquants">
                  <Input value={details.docsMissing} onChange={(e) => setDetails({ ...details, docsMissing: e.target.value })} />
                </Field>
                <Field label="Licences/Autorisations">
                  <Input value={details.licenses} onChange={(e) => setDetails({ ...details, licenses: e.target.value as any })} />
                </Field>
                <Field label="Inspection requise">
                  <Input value={details.inspection} onChange={(e) => setDetails({ ...details, inspection: e.target.value as any })} />
                </Field>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Colis & Marchandises">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Field label="">
                  <div className="text-xs text-gray-500">Besoin d’aide ? Utilisez la recherche de codes SH.</div>
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Description des marchandises">
                  <Input value={parcels.description} onChange={(e) => setParcels({ ...parcels, description: e.target.value })} />
                </Field>
                <Field label="Matières dangereuses">
                  <Input value={parcels.dangerous} onChange={(e) => setParcels({ ...parcels, dangerous: e.target.value as any })} />
                </Field>
                <Field label="Si oui, précisez la classe ADR/IATA et l’emballage.">
                  <Input value={parcels.dangerousDetails} onChange={(e) => setParcels({ ...parcels, dangerousDetails: e.target.value })} />
                </Field>
              </div>

              {/* Lignes articles */}
              <div className="mt-5 space-y-3">
                {parcels.lines.map((line, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="col-span-2">
                      <Label>Qté</Label>
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || "0", 10);
                          const lines = [...parcels.lines];
                          lines[i] = { ...line, qty: v };
                          setParcels({ ...parcels, lines });
                        }}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label>Désignation</Label>
                      <Input
                        value={line.designation}
                        onChange={(e) => {
                          const lines = [...parcels.lines];
                          lines[i] = { ...line, designation: e.target.value };
                          setParcels({ ...parcels, lines });
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Poids (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={line.weightKg}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value || "0");
                          const lines = [...parcels.lines];
                          lines[i] = { ...line, weightKg: v };
                          setParcels({ ...parcels, lines });
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Valeur (USD)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={line.valueUsd}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value || "0");
                          const lines = [...parcels.lines];
                          lines[i] = { ...line, valueUsd: v };
                          setParcels({ ...parcels, lines });
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Code SH</Label>
                      <Input
                        value={line.codeHs}
                        onChange={(e) => {
                          const lines = [...parcels.lines];
                          lines[i] = { ...line, codeHs: e.target.value };
                          setParcels({ ...parcels, lines });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Documents requis">
                  <Input value={parcels.requiredDocs} onChange={(e) => setParcels({ ...parcels, requiredDocs: e.target.value })} />
                </Field>
                <Field label="Notes internes (non visibles client)">
                  <Input value={parcels.internalNotes} onChange={(e) => setParcels({ ...parcels, internalNotes: e.target.value })} />
                </Field>
              </div>

              <div className="mt-4 text-xs text-gray-600">
                Total articles: {parcels.lines.length} • Qté totale:{" "}
                {parcels.lines.reduce((s, l) => s + l.qty, 0)} • Poids:{" "}
                {parcels.lines.reduce((s, l) => s + l.weightKg * l.qty, 0).toFixed(1)} kg • Valeur:{" "}
                {parcels.lines.reduce((s, l) => s + l.valueUsd * l.qty, 0)} USD
              </div>
            </Section>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <Section title="Sélection des services">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, serviceMode: "Express" })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.serviceMode === "Express" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Express / Économique / Fret
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, insuranceDeclared: !services.insuranceDeclared })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.insuranceDeclared ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Assurer l’envoi (valeur déclarée)
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, customsIncluded: !services.customsIncluded })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.customsIncluded ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Inclure le service de dédouanement
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, delivery: services.delivery === "Domicile" ? "Point relais" : "Domicile" })}
                      className="px-3 py-2 rounded-lg border text-sm border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    >
                      À domicile / Point relais
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, pickupSchedule: "Programmer un enlèvement" })}
                      className="px-3 py-2 rounded-lg border text-sm border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Programmer un enlèvement
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, packagingPro: !services.packagingPro })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.packagingPro ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Ajouter emballage professionnel
                    </button>
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, notifyEmailSms: !services.notifyEmailSms })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.notifyEmailSms ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Email + SMS au destinataire
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 mb-3">Options additionnelles</div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {[
                        { key: "pod", label: "Preuve de livraison (POD)" },
                        { key: "signature", label: "Signature requise" },
                        { key: "priority", label: "Priorité traitement" },
                      ].map((opt) => {
                        const checked = (services.options as any)[opt.key];
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setServices({ ...services, options: { ...services.options, [opt.key]: !checked } })}
                            className={`px-3 py-2 rounded-full border ${checked ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Section>

                <Section title="Conditions & Validation">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Notes au transporteur">
                      <Input placeholder="Ex: Appeler avant la livraison" value={services.carrierNotes || ""} onChange={(e) => setServices({ ...services, carrierNotes: e.target.value })} />
                    </Field>
                    <Field label="Références client">
                      <Input placeholder="PO-4589 / Projet Alpha" value={services.clientRef || ""} onChange={(e) => setServices({ ...services, clientRef: e.target.value })} />
                    </Field>
                    <Field label="Conditions générales">
                      <Input value={services.acceptTerms ? "J'accepte les CGV et la politique douanière" : ""} onChange={() => setServices({ ...services, acceptTerms: !services.acceptTerms })} placeholder="J'accepte les CGV et la politique douanière" />
                    </Field>
                    <Field label="Méthode de paiement">
                      <Input value={services.paymentMethod} onChange={(e) => setServices({ ...services, paymentMethod: e.target.value as any })} />
                    </Field>
                  </div>
                </Section>
              </div>

              <div className="space-y-5">
                <RecapCompact />

                <Section title="Devis estimatif" className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <Label>Transport</Label>
                    <Input
                      type="number"
                      value={services.estimate.transport}
                      onChange={(e) =>
                        setServices({ ...services, estimate: { ...services.estimate, transport: Number(e.target.value || 0) } })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        value={services.estimate.transportUnit}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, transportUnit: e.target.value as any } })}
                      />
                      <Input
                        value={services.estimate.transportTax}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, transportTax: e.target.value as any } })}
                      />
                    </div>

                    <Label>Dédouanement</Label>
                    <Input
                      type="number"
                      value={services.estimate.customs}
                      onChange={(e) =>
                        setServices({ ...services, estimate: { ...services.estimate, customs: Number(e.target.value || 0) } })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        value={services.estimate.customsUnit}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, customsUnit: e.target.value as any } })}
                      />
                      <Input
                        value={services.estimate.customsTax}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, customsTax: e.target.value as any } })}
                      />
                    </div>

                    <Label>Assurance</Label>
                    <Input
                      type="number"
                      value={services.estimate.insurance}
                      onChange={(e) =>
                        setServices({ ...services, estimate: { ...services.estimate, insurance: Number(e.target.value || 0) } })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        value={services.estimate.insuranceUnit}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, insuranceUnit: e.target.value as any } })}
                      />
                      <Input
                        value={services.estimate.insuranceTax}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, insuranceTax: e.target.value as any } })}
                      />
                    </div>

                    <Label>Taxes & droits (estim.)</Label>
                    <Input
                      type="number"
                      value={services.estimate.taxes}
                      onChange={(e) =>
                        setServices({ ...services, estimate: { ...services.estimate, taxes: Number(e.target.value || 0) } })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        value={services.estimate.taxesUnit}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, taxesUnit: e.target.value as any } })}
                      />
                      <Input
                        value={services.estimate.taxesTax}
                        onChange={(e) => setServices({ ...services, estimate: { ...services.estimate, taxesTax: e.target.value as any } })}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">HT&nbsp;:</span> {totals.ht} USD &nbsp;&nbsp;
                    <span className="font-medium">TTC estimé&nbsp;:</span> {totals.ttc} USD &nbsp;&nbsp;
                    <span className="font-medium">Délai&nbsp;:</span> {totals.delay}
                  </div>
                </Section>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={saveDraft}
            className="px-4 py-2 rounded-md text-sm text-gray-500 bg-gray-100 border border-gray-200"
          >
            Enregistrer comme brouillon
          </button>

          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="px-4 py-2 rounded-md text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Retour
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 rounded-md text-sm text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                disabled
              >
                Retour
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={finalize}
                className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Finaliser l’envoi
              </button>
            )}
          </div>
        </div>
     { /*</main>*/}
    </MainLayout>
  );
}
