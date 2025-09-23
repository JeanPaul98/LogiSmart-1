import MainLayout from "@/components/layout/MainLayout";
import React, { useMemo, useState } from "react";

// -----------------------------
// Types (inchangés)
// -----------------------------
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

// -----------------------------
// Helpers (léger tuning UI)
// -----------------------------
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

type StepPillProps = { index: number; title: string; active?: boolean; done?: boolean; children?: React.ReactNode };
const StepPill = ({ index, title, active, done }: StepPillProps) => (
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

// clamp qui renvoie 1|2|3|4
const clampStep = (n: number): 1 | 2 | 3 | 4 => {
  const v = Math.max(1, Math.min(4, n));
  return v as 1 | 2 | 3 | 4;
};

// -----------------------------
// Main
// -----------------------------
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

  const finalize = () => {
    if (!services.acceptTerms) {
      alert("Veuillez accepter les CGV et la politique douanière.");
      return;
    }
    alert("Envoi finalisé (mock).");
  };

  const RecapCompact = () => (
    <div className="text-right bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
      <div className="text-sm text-gray-500">Expéditeur</div>
      <div className="font-semibold text-gray-900 truncate">{sender.contact}, {sender.cityZip.split("•")[0]}</div>
      <div className="mt-3 text-sm text-gray-500">Destinataire</div>
      <div className="font-semibold text-gray-900 truncate">{receiver.contact}, {receiver.cityZip.split("•")[0]}</div>
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
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Créer un nouvel envoi</h1>

        {/* Stepper : scrollable en mobile */}
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
{               /*<Field label="Référence client (optionnel)">
                  <Input value={sender.ref || ""} onChange={(e) => setSender({ ...sender, ref: e.target.value })} placeholder="REF-EXP-001" />
                </Field>*/}
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
{               /* <Field label="Instructions de livraison (optionnel)">
                  <Input value={receiver.notes || ""} onChange={(e) => setReceiver({ ...receiver, notes: e.target.value })} placeholder="Ex: Point relais, horaires…" />
                </Field>*/}
              </div>

              {/* Récap rapide */}
            {/* <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-pink-100 overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-semibold text-pink-700">A</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{sender.contact || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{sender.cityZip || sender.country}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">B</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{receiver.contact || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{receiver.cityZip || receiver.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
              {/* Lignes articles */}
{             /* <div className="mt-5 space-y-3">
                {parcels.lines.map((line, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="sm:col-span-2">
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
                    <div className="sm:col-span-4">
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
                    <div className="sm:col-span-2">
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
                    <div className="sm:col-span-2">
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
                    <div className="sm:col-span-2">
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
              </div> */}
            </Section>
          )}

            {step === 3 && (
              <Section title="Documents & conformité">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Documents fournis (fictifs) */}
                  <Field label="Documents fournis">
                    <Input
                      value="Facture commerciale, Bon de livraison"
                      onChange={(e) => setDetails({ ...details, docsProvided: e.target.value })}
                    />
                  </Field>

                  {/* Documents manquants (fictifs) */}
                  <Field label="Documents manquants">
                    <Input
                      value="Certificat d'origine"
                      onChange={(e) => setDetails({ ...details, docsMissing: e.target.value })}
                    />
                  </Field>

                  {/* Licences / Autorisations */}
                  <Field label="Inspection requise">
                    <Input
                      value="Oui" // au lieu de "Inspection phytosanitaire"
                      onChange={(e) => setDetails({ ...details, inspection: e.target.value as "Oui" | "Non" | "Oui / Non" })}
                    />
                  </Field>


                  {/* Inspection requise */}
                  <Field label="Inspection requise">
                    <Input
                      value="Oui" // au lieu de "Inspection phytosanitaire"
                      onChange={(e) => setDetails({ ...details, inspection: e.target.value as "Oui" | "Non" | "Oui / Non" })}
                    />
                  </Field>
                </div>

                {/* Aperçu des fichiers (fictifs) */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Fichiers associés (exemple)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { name: "facture.pdf", size: "120 KB" },
                      { name: "bon_livraison.docx", size: "85 KB" },
                      { name: "photo_colis.png", size: "350 KB" },
                    ].map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg bg-white shadow-sm">
                        <div className="text-gray-600 text-sm truncate">{file.name}</div>
                        <div className="ml-auto text-xs text-gray-400">{file.size}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}



          {step === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Partie gauche : sélection des services */}
              <div className="lg:col-span-2 space-y-5">
{ /*               <Section title="Sélection des services">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setServices({ ...services, serviceMode: "Express" })}
                      className={`px-3 py-2 rounded-lg border text-sm ${services.serviceMode === "Express" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Express / Économique / Fret
                    </button>
                  </div>
                </Section> */}

                {/* Résumé de l'expédition */}
                <Section title="Résumé de l'expédition">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Expéditeur */}
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                      <h4 className="font-semibold text-gray-700 mb-2">Expéditeur</h4>
                      <p><span className="font-medium">Nom :</span> Jean Paul Adzonyo</p>
                      <p><span className="font-medium">Email :</span> jeanpaul@example.com</p>
                      <p><span className="font-medium">Adresse :</span> 123 Rue Principale, Lomé, Togo</p>
                    </div>

                    {/* Destinataire */}
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                      <h4 className="font-semibold text-gray-700 mb-2">Destinataire</h4>
                      <p><span className="font-medium">Nom :</span> Marie Dupont</p>
                      <p><span className="font-medium">Email :</span> marie.dupont@example.com</p>
                      <p><span className="font-medium">Adresse :</span> 456 Avenue Centrale, Paris, France</p>
                    </div>

                    {/* Détails de l'expédition */}
                    <div className="p-4 border rounded-lg shadow-sm bg-white md:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2">Détails de l'expédition</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <p><span className="font-medium">Colis :</span> 2</p>
                        <p><span className="font-medium">Poids :</span> 5 kg</p>
                        <p><span className="font-medium">Volume :</span> 0.02 m³</p>
                        <p><span className="font-medium">Valeur déclarée :</span> 120 USD</p>
                        <p><span className="font-medium">HS Code :</span> 490199</p>
                      </div>
                    </div>

                    {/* Services et options */}
{  /*                  <div className="p-4 border rounded-lg shadow-sm bg-white md:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2">Services & options</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Express", "Assurance", "Dédouanement", "POD", "Signature", "Priorité traitement"].map((service) => (
                          <span key={service} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{service}</span>
                        ))}
                      </div>
                      <p className="mt-2"><span className="font-medium">Livraison :</span> À domicile</p>
                      <p><span className="font-medium">Enlèvement :</span> Programmé</p>
                      <p><span className="font-medium">Emballage pro :</span> Oui</p>
                      <p><span className="font-medium">Notifications :</span> Email + SMS</p>
                    </div> */}

                    {/* Notes et références */}
                    <div className="p-4 border rounded-lg shadow-sm bg-white md:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2">Notes & références</h4>
                      <p><span className="font-medium">Notes transporteur :</span> Appeler avant la livraison</p>
                      <p><span className="font-medium">Références client :</span> PO-4589 / Projet Alpha</p>
                      <p><span className="font-medium">CGV acceptées :</span> Oui</p>
                      <p><span className="font-medium">Méthode de paiement :</span> Carte bancaire</p>
                    </div>
                  </div>
                </Section>
              </div>

              {/* Partie droite : récapitulatif des coûts */}
              <div className="space-y-5">
                <RecapCompact />

                <Section title="Devis estimatif" className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between"><div>Transport</div><div>50 USD</div></div>
                  <div className="flex justify-between"><div>Dédouanement</div><div>20 USD</div></div>
                  <div className="flex justify-between"><div>Assurance</div><div>10 USD</div></div>
                  <div className="flex justify-between"><div>Taxes & droits</div><div>15 USD</div></div>
                  <div className="mt-2">
                    <div><span className="font-medium">Total HT :</span> 95 USD</div>
                    <div><span className="font-medium">TTC estimé :</span> 105 USD</div>
                    <div><span className="font-medium">Délai :</span> 2-3 jours</div>
                  </div>
                </Section>
              </div>
            </div>
          )}


        </div>

        {/* Footer actions : stack en mobile */}
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
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Finaliser l’envoi
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
