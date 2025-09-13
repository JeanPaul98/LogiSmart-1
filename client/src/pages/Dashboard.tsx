// src/pages/CalculTarif.tsx
import MainLayout from "@/components/layout/MainLayout";
import React, { useState } from "react";
import { Link } from "wouter";

export default function CalculTarif() {
  // états de formulaire (mock)
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    goodsType: "",
    incoterm: "",
    weight: "",
    volume: "",
    dims: "",
    mode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: brancher ton API de calcul
    alert("Calcul lancé (démo)");
  };
  return (
      <MainLayout>

            <div className="flex">
              {/* Main */}
              <main className="flex-1 pt-4 pb-16">
                <h1 className="text-xl font-bold text-gray-900">Calcul de tarifs</h1>
                {/* Suivi de colis */}
                <section className="mt-4 rounded-lg border bg-white">
                  <div className="px-5 py-4 border-b">
                    <p className="font-semibold text-gray-900">Suivi de colis</p>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2">
                      <input
                        placeholder="Ex: LGS-ABC123456"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button className="h-9 rounded-md bg-blue-600 px-4 text-white text-sm font-semibold hover:bg-blue-700">
                        Suivre
                      </button>
                    </div>

                    {/* Timeline */}
                    <ol className="mt-6 space-y-6">
                      {[
                        { title: "Commande confirmée", date: "12 Jan 2025 · 10:22" },
                        { title: "Pris en charge par l'entrepôt", date: "13 Jan 2025 · 09:10" },
                        { title: "En transit", date: "15 Jan 2025 · 18:40" },
                      ].map((s, i) => (
                        <li key={i} className="relative pl-6">
                          <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <p className="text-sm font-medium text-gray-900">{s.title}</p>
                          <p className="text-xs text-gray-500">{s.date}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>

                {/* Recherche de codes SH */}
                <section className="mt-4 rounded-lg border bg-white">
                  <div className="px-5 py-4 border-b">
                    <p className="font-semibold text-gray-900">Recherche de codes SH</p>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-3">
                      <input
                        placeholder="Ex: ordinateurs portables"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Rechercher
                      </button>
                      <button className="rounded-md border px-3 py-2 text-sm text-gray-600 bg-gray-100">
                        Filtres
                      </button>
                    </div>

                    <div className="mt-4 divide-y rounded-md border overflow-hidden">
                      {[
                        {
                          code: "8471.30",
                          title: "Ordinateurs et portables",
                          sub: "Appareils de traitement de données, non assemblés",
                        },
                        {
                          code: "8517.12",
                          title: "Téléphones mobiles",
                          sub: "Appareils pour réseaux cellulaires",
                        },
                        {
                          code: "6403.59",
                          title: "Chaussures en cuir",
                          sub: "Semelles en caoutchouc ou plastique",
                        },
                      ].map((r, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between px-4 py-3 ${
                            i === 0 ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.title}</p>
                            <p className="text-xs text-gray-500">{r.sub}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-blue-700 underline">
                              {r.code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="text-xs text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-2 mt-8">
                  <span>Contact: support@logismart.africa</span>
                  <span className="hidden sm:inline">|</span>
                  <a className="hover:underline" href="#">Centre d'aide</a>
                  <span className="hidden sm:inline">|</span>
                  <a className="hover:underline" href="#">Conditions</a>
                  <span className="hidden sm:inline">|</span>
                  <a className="hover:underline" href="#">Confidentialité</a>
                  <span className="ml-auto text-gray-400">© 2025 LogiSmart</span>
                </footer>

                
              </main>
            </div>
      </MainLayout>
  );
}
/** Petit composant lecture seule (étiquette + valeur) */
function FieldRead({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <div className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm flex items-center text-gray-900">
        {value}
      </div>
    </div>
  );
}
