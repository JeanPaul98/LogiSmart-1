import React, { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";

/* -----------------------------
   Helpers UI (identiques à CreateShipment)
----------------------------- */
type SectionProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

const Section = ({ title, subtitle, right, className, children }: SectionProps) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-6 ${className || ""}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[15px] sm:text-base font-semibold text-gray-900">{title}</h3>
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
      "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-[14px] " +
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

type StepPillProps = { index: number; title: string; active?: boolean; done?: boolean };
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

const clampStep = (n: number): 1 | 2  => {
  const v = Math.max(1, Math.min(3, n));
  return v as 1 | 2 ;
};

/* -----------------------------
   Types & États
----------------------------- */
type FormState = {
  origine: string;
  destination: string;
  mode: string;
  poids: string;
  volume: string;
  incoterm: string;
  valeur: string;
  typeMarchandise: string;
  codeSH?: string;
};

type OptionsState = {
  delai: string;
  emballage: string;
  services: string;
  assurance: string;
  paiement: string;
  devise: string;
};

export default function CalculTarif() {
  const [step, setStep] = useState<1 | 2 >(1);

  // Formulaire (étape 1)
  const [form, setForm] = useState<FormState>({
    origine: "",
    destination: "",
    mode: "",
    poids: "",
    volume: "",
    incoterm: "",
    valeur: "",
    typeMarchandise: "",
    codeSH: "",
  });

  // Options (étape 2)
  const [opt, setOpt] = useState<OptionsState>({
    delai: "Standard (3-5 j)",
    emballage: "Palette",
    services: "Collecte / Dégroupage / Douane",
    assurance: "Oui",
    paiement: "Prépayé",
    devise: "USD",
  });

  // Estimations (étape 3)
  const [estimate, setEstimate] = useState({
    fret: 420,
    douane: 260,
    assurance: 35,
    dernierKm: 48,
  });

  const total = useMemo(() => {
    const t = estimate.fret + estimate.douane + estimate.assurance + estimate.dernierKm;
    return { amount: t, eta: opt.delai.includes("Express") ? "1-2 j" : "3-4 j" };
  }, [estimate, opt.delai]);

  const next = () => setStep((s) => clampStep(s + 1));
  const back = () => setStep((s) => clampStep(s - 1));

  const reset = () => {
    setForm({
      origine: "",
      destination: "",
      mode: "",
      poids: "",
      volume: "",
      incoterm: "",
      valeur: "",
      typeMarchandise: "",
      codeSH: "",
    });
  };

  const handleCalc = () => {
    // ici tu pourras plugger ton calcul réel (backend)
    // petit mock: poids/volume influent légèrement le fret
    const base = 420;
    const poids = parseFloat(form.poids.replace(/[^\d.]/g, "")) || 0;
    const volume = parseFloat(form.volume.replace(/[^\d.]/g, "")) || 0;
    const coef = 1 + Math.min(poids / 1000, 0.5) + Math.min(volume / 10, 0.2);
    setEstimate((e) => ({ ...e, fret: Math.round(base * coef) }));
    setStep(2);
  };

  return (
    <MainLayout>
      {/* plein large, non centré */}
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* Header + toggle national/international */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calculateur de tarifs</h2>
          <div className="flex items-center justify-start sm:justify-end space-x-2 text-sm text-gray-600 border border-gray-300 rounded-full w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-1">National</button>
            <button className="flex-1 sm:flex-none px-4 py-1 bg-white rounded-full shadow-sm text-gray-900">
              International
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-2 flex flex-wrap gap-3">
          <StepPill index={1} title="Détails de l’expédition" active={step === 1} done={step > 1} />
{  /*        <StepPill index={2} title="Paramètres & options" active={step === 2} done={step > 2} />    */}
          <StepPill index={2} title="Estimation & Résumé" active={step === 2} />
          <div className="ml-auto text-xs text-gray-500">Étape {step} sur 2</div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 grid grid-cols-1 gap-5">
          {/* STEP 1 */}
          {step === 1 && (
            <Section
              title="Détails de l'expédition"
              subtitle="Renseigne les informations nécessaires pour estimer le tarif."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { key: "origine", label: "Origine", placeholder: "Ville / Pays" },
                  { key: "destination", label: "Destination", placeholder: "Ville / Pays" },
                  { key: "mode", label: "Mode", placeholder: "Aérien / Maritime / Routier" },
                  { key: "poids", label: "Poids total", placeholder: "Ex: 250 kg" },
                  { key: "volume", label: "Volume", placeholder: "Ex: 1.2 m³" },
                  { key: "incoterm", label: "Incoterm", placeholder: "EXW / FOB / CIF..." },
                  { key: "valeur", label: "Valeur déclarée", placeholder: "Ex: $12,000" },
                  { key: "typeMarchandise", label: "Type de marchandise", placeholder: "Générale / Fragile / Dangereuse" },
                  { key: "codeSH", label: "Code SH (optionnel)", placeholder: "Rechercher un code" },
                ].map((f) => (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    <Input
                      placeholder={f.placeholder}
                      value={(form as any)[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                <button
                  onClick={reset}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Effacer
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Suivant
                </button>
              </div>
            </Section>
          )}

          {/* STEP 2 */}
{   /*       {step === 2 && (
            <Section
              title="Paramètres & options"
              subtitle="Affiner l’estimation avec vos préférences de service."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "delai", label: "Délai souhaité", placeholder: "Standard (3-5 j) / Express" },
                  { key: "emballage", label: "Emballage", placeholder: "Palette / Cartons / VRAC" },
                  { key: "services", label: "Services", placeholder: "Collecte / Dégroupage / Douane" },
                  { key: "assurance", label: "Assurance", placeholder: "Oui / Non" },
                  { key: "paiement", label: "Paiement", placeholder: "Prépayé / À la livraison" },
                  { key: "devise", label: "Devise", placeholder: "USD / EUR / NGN / GHS" },
                ].map((o) => (
                  <div key={o.key}>
                    <Label>{o.label}</Label>
                    <Input
                      placeholder={o.placeholder}
                      value={(opt as any)[o.key] || ""}
                      onChange={(e) => setOpt({ ...opt, [o.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                <div className="text-xs text-gray-500">Les paramètres influencent les coûts et délais.</div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={back}
                    className="flex-1 sm:flex-none bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleCalc}
                    className="flex-1 sm:flex-none bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Calculer
                  </button>
                </div>
              </div>
            </Section>
          )}  */}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Estimation des coûts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    ["Fret", `$${estimate.fret}`],
                    ["Frais douaniers", `$${estimate.douane}`],
                    ["Assurance", `$${estimate.assurance}`],
                    ["Dernier km", `$${estimate.dernierKm}`],
                  ].map(([label, amount], i) => (
                    <div key={i} className="bg-amber-100 p-4 rounded-lg">
                      <p className="text-sm text-amber-800">{label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-900">{amount}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-gray-500">Taux estimés, hors taxes locales</p>
                </div>
              </Section>

              <Section title="Résumé du devis">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-4 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm sm:text-base">
                    {form.origine || "Origine"} → {form.destination || "Destination"} • {form.mode || "Mode"} • {form.poids || "0 kg"}
                  </p>
                  <p className="font-semibold text-gray-900">Prêt</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                  <p className="text-gray-700 font-medium">Total estimé</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${total.amount} <span className="text-sm font-normal text-gray-500">ETA {total.eta}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={back}
                      className="w-full sm:w-auto bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Recommencer
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                      Exporter PDF
                    </button>
                    <button className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                      Créer l'expédition
                    </button>
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
