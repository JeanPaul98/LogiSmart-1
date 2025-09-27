// src/pages/CalculTarif.tsx
import React, { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";

/* ===========================
   Config API
=========================== */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

/* ===========================
   Données de sélection
=========================== */
type Country = { code: string; label: string };
const COUNTRIES: Country[] = [
  { code: "FR", label: "France" },
  { code: "CA", label: "Canada" },
  { code: "US", label: "États-Unis" },
  { code: "GH", label: "Ghana" },
  { code: "NG", label: "Nigéria" },
  { code: "CI", label: "Côte d’Ivoire" },
  { code: "TG", label: "Togo" },
  { code: "BJ", label: "Bénin" },
  { code: "ML", label: "Mali" },
  { code: "NE", label: "Niger" },
  { code: "SN", label: "Sénégal" },
  { code: "DE", label: "Allemagne" },
  { code: "ES", label: "Espagne" },
  { code: "IT", label: "Italie" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "MA", label: "Maroc" },
  { code: "DZ", label: "Algérie" },
  { code: "TN", label: "Tunisie" },
  { code: "EG", label: "Égypte" },
  { code: "ZA", label: "Afrique du Sud" },
];

const TRANSPORT_MODES = [
  { value: "air", label: "Aérien" },
  { value: "sea", label: "Maritime" },
  { value: "road", label: "Routier" },
] as const;

const INCOTERMS = [
  { value: "EXW", label: "EXW – Ex Works" },
  { value: "FCA", label: "FCA – Free Carrier" },
  { value: "FAS", label: "FAS – Free Alongside Ship" },
  { value: "FOB", label: "FOB – Free On Board" },
  { value: "CFR", label: "CFR – Cost and Freight" },
  { value: "CIF", label: "CIF – Cost, Insurance & Freight" },
  { value: "CPT", label: "CPT – Carriage Paid To" },
  { value: "CIP", label: "CIP – Carriage & Insurance Paid" },
  { value: "DAP", label: "DAP – Delivered At Place" },
  { value: "DPU", label: "DPU – Delivered at Place Unloaded" },
  { value: "DDP", label: "DDP – Delivered Duty Paid" },
] as const;

const CARGO_TYPES = [
  { value: "generale", label: "Générale" },
  { value: "fragile", label: "Fragile" },
  { value: "dangereuse", label: "Dangereuse" },
  { value: "perissable", label: "Périssable" },
  { value: "liquide", label: "Liquide" },
  { value: "electronique", label: "Électronique" },
  { value: "pharmaceutique", label: "Pharmaceutique" },
  { value: "textile", label: "Textile" },
  { value: "automobile", label: "Automobile" },
] as const;

const flagEmoji = (iso2: string) =>
  String.fromCodePoint(
    ...(iso2.toUpperCase().split("") as [string, string]).map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );

/* ===========================
   Helpers UI
=========================== */
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

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { children?: React.ReactNode; invalid?: boolean };
const Input = ({ invalid, ...props }: InputProps) => (
  <input
    {...props}
    className={
      "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-[14px] " +
      (invalid
        ? "border-red-400 focus:ring-red-500"
        : "border-gray-300 focus:ring-orange-500") +
      (" " + (props.className || ""))
    }
    aria-invalid={invalid ? "true" : undefined}
  />
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { children?: React.ReactNode; invalid?: boolean };
const Select = ({ invalid, ...props }: SelectProps) => (
  <select
    {...props}
    className={
      "w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 text-[14px] " +
      (invalid
        ? "border-red-400 focus:ring-red-500"
        : "border-gray-300 focus:ring-orange-500") +
      (" " + (props.className || ""))
    }
    aria-invalid={invalid ? "true" : undefined}
  />
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

const StepPill = ({
  index,
  title,
  active,
  done,
}: {
  index: number;
  title: string;
  active?: boolean;
  done?: boolean;
}) => (
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

const clampStep = (n: number): 1 | 2 => {
  const v = Math.max(1, Math.min(2, n));
  return v as 1 | 2;
};

// Formattage monétaire
const fmtMoney = (n: number, currency = "XOF") =>
  isFinite(n)
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency, minimumFractionDigits: 0 }).format(n)
    : "—";


/* ===========================
   Types & États
=========================== */
type FormState = {
  originCountry: string;
  destinationCountry: string;
  mode: "air" | "sea" | "road" | "";
  incoterm: (typeof INCOTERMS)[number]["value"] | "";
  cargoType: (typeof CARGO_TYPES)[number]["value"] | "";
  poids: string;
  volume: string; // ← optionnel maintenant
  valeur: string;
  packageCount?: string;
  serviceType?: "express" | "standard" | "economy" | string;
  insurance?: "Oui" | "Non" | string;
};

type TariffAPI = {
  success: boolean;
  tariff: {
    id: number;
    totalCost: number;
    baseCost: number;
    insuranceCost: number;
    customsDuty: number;
    vat?: number;
    estimatedDays?: number;
    distanceFactor?: string;
    volumetricWeight?: number;
    createdAt?: string;
    updatedAt?: string;
  };
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CalculTarif() {
  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState<FormState>({
    originCountry: "",
    destinationCountry: "",
    mode: "",
    incoterm: "",
    cargoType: "",
    poids: "",
    volume: "", // optionnel
    valeur: "",
    packageCount: "",
    serviceType: "",
    insurance: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Estimations (étape 2)
  const [estimate, setEstimate] = useState({ fret: 0, douane: 0, assurance: 0, dernierKm: 0 });
  const [vat, setVat] = useState<number | undefined>(undefined);
  const [volumetricWeight, setVolumetricWeight] = useState<number | undefined>(undefined);
  const [etaText, setEtaText] = useState<string | undefined>(undefined);

  const total = useMemo(() => {
    const t = estimate.fret + estimate.douane + estimate.assurance + estimate.dernierKm;
    const fallbackEta = (form.serviceType || "").toLowerCase().includes("express") ? "1-2 j" : "3-4 j";
    return { amount: t, eta: etaText ?? fallbackEta };
  }, [estimate, form.serviceType, etaText]);

  const [loadingCalc, setLoadingCalc] = useState(false);

  const reset = () => {
    setForm({
      originCountry: "",
      destinationCountry: "",
      mode: "",
      incoterm: "",
      cargoType: "",
      poids: "",
      volume: "",
      valeur: "",
      packageCount: "",
      serviceType: "",
      insurance: "",
    });
    setErrors({});
    setShowErrorBanner(false);
    setEstimate({ fret: 0, douane: 0, assurance: 0, dernierKm: 0 });
    setVat(undefined);
    setVolumetricWeight(undefined);
    setEtaText(undefined);
    setStep(1);
  };

  /* ===========================
     Validation (volume optionnel)
  ========================== */
  const validate = (f: FormState): { ok: boolean; errors: FormErrors } => {
    const e: FormErrors = {};
    const num = (v: string) => Number.parseFloat(v);
    const int = (v: string) => Number.parseInt(v, 10);

    if (!f.originCountry) e.originCountry = "Sélectionne le pays d’origine.";
    if (!f.destinationCountry) e.destinationCountry = "Sélectionne le pays de destination.";
    if (!f.mode) e.mode = "Sélectionne le mode de transport.";
    if (!f.incoterm) e.incoterm = "Sélectionne l’Incoterm.";
    if (!f.cargoType) e.cargoType = "Sélectionne le type de marchandise.";
    if (!f.serviceType) e.serviceType = "Sélectionne le service.";
    if (!f.insurance) e.insurance = "Sélectionne Oui ou Non.";

    if (!f.poids) e.poids = "Renseigne le poids total.";
    else if (!(num(f.poids) > 0)) e.poids = "Le poids doit être un nombre > 0.";

    // Volume: complètement optionnel. Si renseigné, vérifier la validité > 0
    if (f.volume && !(num(f.volume) > 0)) e.volume = "Le volume doit être un nombre > 0.";

    if (!f.valeur) e.valeur = "Renseigne la valeur déclarée.";
    else if (!(num(f.valeur) > 0)) e.valeur = "La valeur doit être un nombre > 0.";

    if (!f.packageCount) e.packageCount = "Renseigne le nombre de colis.";
    else if (!(int(f.packageCount) > 0)) e.packageCount = "Le nombre de colis doit être un entier > 0.";

    return { ok: Object.keys(e).length === 0, errors: e };
  };

  /* ===========================
     Appel API (bloqué si erreurs)
  ========================== */
  const handleCalc = async () => {
    const v = validate(form);
    setErrors(v.errors);
    setShowErrorBanner(!v.ok);

    if (!v.ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoadingCalc(true);
      setErrors({});
      setShowErrorBanner(false);

      const payload = {
        originCountry: form.originCountry,
        destinationCountry: form.destinationCountry,
        transportMode: form.mode || "air",
        weight: parseFloat(form.poids) || 0,
        // volume optionnel : si vide => 0
        volume: form.volume ? parseFloat(form.volume) : 0,
        declaredValue: parseFloat(form.valeur) || 0,
        incoterm: form.incoterm || undefined,
        cargoType: form.cargoType || undefined,
        insurance: (form.insurance || "").toLowerCase() === "oui",
        packageCount: parseInt(form.packageCount || "1", 10) || 1,
        serviceType: (form.serviceType || "standard").toLowerCase(),
      };

      const res = await fetch(`${API_BASE}/api/tariff/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: TariffAPI = await res.json();
      if (!data?.success || !data?.tariff) throw new Error("Réponse API inattendue");
      const t = data.tariff;

      const fret = t.baseCost ?? 0;
      const douane = t.customsDuty ?? 0;
      const assurance = t.insuranceCost ?? 0;
      const totalAPI = t.totalCost ?? fret + douane + assurance;
      const dernierKm = Math.max(0, totalAPI - (fret + douane + assurance));

      setEstimate({ fret, douane, assurance, dernierKm });
      setVat(t.vat);
      setVolumetricWeight(t.volumetricWeight);
      setEtaText(t.estimatedDays ? `${t.estimatedDays} j` : undefined);

      setStep(2);
    } catch (error: any) {
      console.error("Erreur lors de l'estimation :", error);
      alert(`Impossible de récupérer l'estimation : ${error?.message || "Erreur inconnue"}`);
    } finally {
      setLoadingCalc(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calculateur de tarifs</h2>
          <div className="flex items-center justify-start sm:justify-end space-x-2 text-sm text-gray-600 border border-gray-300 rounded-full w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-1">National</button>
            <button className="flex-1 sm:flex-none px-4 py-1 bg-white rounded-full shadow-sm text-gray-900">
              International
            </button>
          </div>
        </div>

        {/* BANNIÈRE D’ERREUR (générique) */}
        {showErrorBanner && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Merci de renseigner les champs
          </div>
        )}

        {/* Stepper */}
        <div className="mt-2 flex flex-wrap gap-3">
          <StepPill index={1} title="Détails de l’expédition" active={step === 1} done={step > 1} />
          <StepPill index={2} title="Estimation & Résumé" active={step === 2} />
          <div className="ml-auto text-xs text-gray-500">Étape {step} sur 2</div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 grid grid-cols-1 gap-5">
          {/* STEP 1 */}
          {step === 1 && (
            <Section
              title="Détails de l'expédition"
              subtitle="Sélectionne l'origine, la destination et les paramètres de ton envoi."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Origine */}
                <div>
                  <Label>Pays d’origine *</Label>
                  <Select
                    value={form.originCountry}
                    onChange={(e) => setForm({ ...form, originCountry: e.target.value })}
                    invalid={!!errors.originCountry}
                  >
                    <option value="">— Sélectionner —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {flagEmoji(c.code)} {c.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.originCountry} />
                </div>

                {/* Destination */}
                <div>
                  <Label>Pays de destination *</Label>
                  <Select
                    value={form.destinationCountry}
                    onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
                    invalid={!!errors.destinationCountry}
                  >
                    <option value="">— Sélectionner —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {flagEmoji(c.code)} {c.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.destinationCountry} />
                </div>

                {/* Mode */}
                <div>
                  <Label>Mode de transport *</Label>
                  <Select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value as FormState["mode"] })}
                    invalid={!!errors.mode}
                  >
                    <option value="">— Sélectionner —</option>
                    {TRANSPORT_MODES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.mode} />
                </div>

                {/* Incoterm */}
                <div>
                  <Label>Incoterm *</Label>
                  <Select
                    value={form.incoterm}
                    onChange={(e) => setForm({ ...form, incoterm: e.target.value as FormState["incoterm"] })}
                    invalid={!!errors.incoterm}
                  >
                    <option value="">— Sélectionner —</option>
                    {INCOTERMS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.incoterm} />
                </div>

                {/* Type de marchandise */}
                <div>
                  <Label>Type de marchandise *</Label>
                  <Select
                    value={form.cargoType}
                    onChange={(e) => setForm({ ...form, cargoType: e.target.value as FormState["cargoType"] })}
                    invalid={!!errors.cargoType}
                  >
                    <option value="">— Sélectionner —</option>
                    {CARGO_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.cargoType} />
                </div>

                {/* Poids */}
                <div>
                  <Label>Poids total (kg) *</Label>
                  <Input
                    placeholder="Ex: 120.5"
                    value={form.poids}
                    onChange={(e) => setForm({ ...form, poids: e.target.value })}
                    inputMode="decimal"
                    invalid={!!errors.poids}
                  />
                  <FieldError message={errors.poids} />
                </div>

                {/* Volume — OPTIONNEL */}
                <div>
                  <Label>Volume (m³) <span className="text-gray-400">(optionnel)</span></Label>
                  <Input
                    placeholder="Ex: 2.4"
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    inputMode="decimal"
                    invalid={!!errors.volume}
                  />
                  <FieldError message={errors.volume} />
                </div>

                {/* Valeur déclarée */}
                <div>
                  <Label>Valeur déclarée *</Label>
                  <Input
                    placeholder="Ex: 5000"
                    value={form.valeur}
                    onChange={(e) => setForm({ ...form, valeur: e.target.value })}
                    inputMode="decimal"
                    invalid={!!errors.valeur}
                  />
                  <FieldError message={errors.valeur} />
                </div>

                {/* Nombre de colis */}
                <div>
                  <Label>Nombre de colis *</Label>
                  <Input
                    placeholder="1"
                    value={form.packageCount || ""}
                    onChange={(e) => setForm({ ...form, packageCount: e.target.value })}
                    inputMode="numeric"
                    invalid={!!errors.packageCount}
                  />
                  <FieldError message={errors.packageCount} />
                </div>

                {/* Service */}
                <div>
                  <Label>Service *</Label>
                  <Select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    invalid={!!errors.serviceType}
                  >
                    <option value="">— Sélectionner —</option>
                    <option value="express">Express</option>
                    <option value="standard">Standard</option>
                    <option value="economy">Économique</option>
                  </Select>
                  <FieldError message={errors.serviceType} />
                </div>

                {/* Assurance */}
                <div>
                  <Label>Assurance *</Label>
                  <Select
                    value={form.insurance}
                    onChange={(e) => setForm({ ...form, insurance: e.target.value })}
                    invalid={!!errors.insurance}
                  >
                    <option value="">— Sélectionner —</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </Select>
                  <FieldError message={errors.insurance} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                <button
                  onClick={reset}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  disabled={loadingCalc}
                >
                  Effacer
                </button>
                <button
                  onClick={handleCalc}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                  disabled={loadingCalc}
                >
                  {loadingCalc ? "Calcul en cours..." : "Calculer"}
                </button>
              </div>
            </Section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Estimation des coûts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    ["Fret", fmtMoney(estimate.fret)],
                    ["Frais douaniers", fmtMoney(estimate.douane)],
                    ["Assurance", fmtMoney(estimate.assurance)],
                    ["Dernier km", fmtMoney(estimate.dernierKm)],
                  ].map(([label, amount], i) => (
                    <div key={i} className="bg-amber-100 p-4 rounded-lg">
                      <p className="text-sm text-amber-800">{label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-900">{amount}</p>
                    </div>
                  ))}
                </div>

                {(vat !== undefined || volumetricWeight !== undefined) && (
                  <div className="text-xs text-gray-600">
                    {vat !== undefined && <span className="mr-3">TVA: {fmtMoney(vat)}</span>}
                    {volumetricWeight !== undefined && <span>Poids volumétrique: {volumetricWeight.toFixed(2)} kg</span>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                  <p className="text-xs text-gray-500">Taux estimés, hors taxes locales</p>
                </div>
              </Section>

              <Section title="Résumé du devis">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-4 border-b border-gray-200 gap-2">
                  <p className="text-gray-700 text-sm sm:text-base">
                    {flagEmoji(form.originCountry)} {form.originCountry} → {flagEmoji(form.destinationCountry)} {form.destinationCountry}
                    {" • "}
                    {TRANSPORT_MODES.find((m) => m.value === form.mode)?.label || "Mode"}
                    {" • "}
                    {form.poids || "0"} kg
                  </p>
                  <p className="font-semibold text-gray-900">Prêt</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                  <p className="text-gray-700 font-medium">Total estimé</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {fmtMoney(estimate.fret + estimate.douane + estimate.assurance + estimate.dernierKm)}{" "}
                    <span className="text-sm font-normal text-gray-500">ETA {total.eta}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={reset}
                      className="w-full sm:w-auto bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
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
