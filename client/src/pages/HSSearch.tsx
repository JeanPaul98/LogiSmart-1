import MainLayout from "@/components/layout/MainLayout";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

type HSItem = {
  code: string;
  description: string;
  vat: number;
  duty: number;
};

const MOCK_RESULTS: HSItem[] = [
  { code: "8471.30", description: "Machines automatiques de traitement de l'information portatives, poids <= 10 kg", vat: 10, duty: 5 },
  { code: "8517.12", description: "Téléphones pour réseaux cellulaires", vat: 18, duty: 0 },
  { code: "6403.59", description: "Chaussures à semelles caoutchouc/plastique et dessus cuir", vat: 18, duty: 12 },
  { code: "9503.00", description: "Jouets et modèles réduits, puzzles", vat: 18, duty: 5 },
];

export default function HSSearch() {
  const [, setLocation] = useLocation();

  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState<string>("Côte d'Ivoire");
  const [chapter, setChapter] = useState("01 à 97");
  const [direction, setDirection] = useState("Importation / Exportation");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selected, setSelected] = useState<HSItem | null>(MOCK_RESULTS[0]);

  const filtered = useMemo(() => {
    return MOCK_RESULTS.filter((it) =>
      it.description.toLowerCase().includes(keyword.trim().toLowerCase()) ||
      it.code.includes(keyword.trim())
    );
  }, [keyword]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setCountry("");
    setChapter("01 à 97");
    setDirection("Importation / Exportation");
    setPage(1);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
        {/* ===== Main ===== */}
        <main className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recherche de codes SH</h2>
            <span className="text-sm text-gray-500">Catalogue mondial</span>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-4 md:p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recherche</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mot-clé</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: ordinateurs portables"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pays de destination</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Côte d'Ivoire, Sénégal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chapitre SH</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sens</label>
                <input
                  type="text"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                onClick={() => alert("Filtres avancés à implémenter")}
              >
                Filtres avancés
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 w-full sm:w-auto"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* KPIs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Résultats</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Taux moyen de droits</p>
              <p className="text-2xl font-bold text-gray-800">
                {total ? `${Math.round(filtered.reduce((s, it) => s + it.duty, 0) / total)}%` : "—"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Pays sélectionné</p>
              <p className="text-2xl font-bold text-gray-800">{country || "—"}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="text-2xl font-bold text-gray-800">Jan 2025</p>
            </div>
          </div>

          {/* Table responsive */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <h3 className="p-4 md:p-6 text-lg font-semibold text-gray-800">Résultats de la recherche</h3>
            <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3">Code SH</th>
                  <th className="px-4 md:px-6 py-3">Description</th>
                  <th className="px-4 md:px-6 py-3">Droits & taxes</th>
                  <th className="px-4 md:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((it) => (
                  <tr key={it.code} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 font-medium text-blue-600 underline">{it.code}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-900">{it.description}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-900">{it.vat}% TVA • {it.duty}% droits</td>
                    <td className="px-4 md:px-6 py-4">
                      <button
                        onClick={() => setSelected(it)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full sm:w-auto"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
                {!pageData.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      Aucun résultat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 space-y-3 sm:space-y-0">
              <div className="flex space-x-2">
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <span className="text-sm text-gray-500">Page {page} sur {totalPages}</span>
            </div>
          </div>

          {/* Détails */}
          <div className="mt-6 bg-white p-4 md:p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fiche détaillée</h3>
            {selected ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-sm text-gray-700">Code SH</p>
                    <p className="font-medium text-gray-900">{selected.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Pays</p>
                    <p className="font-medium text-gray-900">{country || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Droits de douane</p>
                    <p className="font-medium text-gray-900">{selected.duty}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">TVA</p>
                    <p className="font-medium text-gray-900">{selected.vat}%</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-700">Description</p>
                    <p className="text-gray-900">{selected.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                    onClick={() => alert(`Ajouté ${selected.code} aux favoris`)}
                  >
                    Ajouter aux favoris
                  </button>
                  <button
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full sm:w-auto"
                    onClick={() => setLocation("/create")}
                  >
                    Utiliser dans un calcul
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Sélectionnez une ligne dans les résultats pour afficher les détails.</p>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
