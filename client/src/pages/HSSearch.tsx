import MainLayout from "@/components/layout/MainLayout";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

type HSItem = {
  code: string;
  description: string;
  vat: number;        // TVA
  duty: number;       // droits de douane
};

const MOCK_RESULTS: HSItem[] = [
  { code: "8471.30", description: "Machines automatiques de traitement de l'information portatives, poids <= 10 kg", vat: 10, duty: 5 },
  { code: "8517.12", description: "Téléphones pour réseaux cellulaires", vat: 18, duty: 0 },
  { code: "6403.59", description: "Chaussures à semelles caoutchouc/plastique et dessus cuir", vat: 18, duty: 12 },
  { code: "9503.00", description: "Jouets et modèles réduits, puzzles", vat: 18, duty: 5 },
];

export default function HSSearch() {
  const [, setLocation] = useLocation();

  // Form state
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState<string>("Côte d'Ivoire");
  const [chapter, setChapter] = useState("01 à 97");
  const [direction, setDirection] = useState("Importation / Exportation");

  // Results state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Item sélectionné pour la fiche détaillée
  const [selected, setSelected] = useState<HSItem | null>(MOCK_RESULTS[0]);

  // Filtres “mock” sur data locale (à remplacer par ton fetch API)
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
    // Ici tu peux appeler ton endpoint :
    // fetch(`/api/hs?keyword=${keyword}&country=${country}&chapter=${chapter}&direction=${direction}`)
    //   .then(r => r.json()).then(setResults)
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
        <div className="flex h-screen">
          {/* ===== Main ===== */}
          <main className="flex-1">
            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recherche de codes SH</h2>
                <span className="text-sm text-gray-500">Catalogue mondial</span>
              </div>

              {/* Bloc recherche */}
              <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recherche</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="mot-cle" className="block text-sm font-medium text-gray-700">Mot-clé</label>
                    <input
                      id="mot-cle"
                      type="text"
                      placeholder="Ex: ordinateurs portables"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="pays-destination" className="block text-sm font-medium text-gray-700">Pays de destination</label>
                    <input
                      id="pays-destination"
                      type="text"
                      placeholder="Sélectionner (ex: Côte d'Ivoire, Sénégal, Maroc)"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="chapitre-sh" className="block text-sm font-medium text-gray-700">Chapitre SH</label>
                    <input
                      id="chapitre-sh"
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="sens" className="block text-sm font-medium text-gray-700">Sens</label>
                    <input
                      id="sens"
                      type="text"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => alert("Filtres avancés à implémenter")}
                  >
                    <span className="material-symbols-outlined text-base mr-2">filter_alt</span>
                    Filtres avancés
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Rechercher
                  </button>
                </div>
              </form>

              {/* KPIs */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Résultats</p>
                  <p className="text-2xl font-bold text-gray-800">{total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Taux moyen de droits</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {/* moyenne simple mock */}
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

              {/* Table résultats */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <h3 className="p-6 text-lg font-semibold text-gray-800">Résultats de la recherche</h3>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Code SH</th>
                      <th scope="col" className="px-6 py-3">Description</th>
                      <th scope="col" className="px-6 py-3">Droits & taxes</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((it, idx) => {
                      const isActive = selected?.code === it.code;
                      return (
                        <tr key={it.code} className={`${isActive ? "bg-blue-50" : "bg-white"} border-b`}>
                          <td className="px-6 py-4 font-medium text-blue-600 underline">{it.code}</td>
                          <td className="px-6 py-4 text-gray-900">{it.description}</td>
                          <td className="px-6 py-4 text-gray-900">{it.vat}% TVA • {it.duty}% droits</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelected(it)}
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!pageData.length && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          Aucun résultat
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-6">
                  <div>
                    <button
                      onClick={goPrev}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={goNext}
                      disabled={page === totalPages}
                      className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Page {page} sur {totalPages}</span>
                </div>
              </div>

              {/* Fiche détaillée */}
              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fiche détaillée</h3>
                {selected ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Code SH</label>
                        <p className="mt-1 text-gray-900 font-medium">{selected.code}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pays</label>
                        <p className="mt-1 text-gray-900 font-medium">{country || "—"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Droits de douane</label>
                        <p className="mt-1 text-gray-900 font-medium">{selected.duty}%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">TVA</label>
                        <p className="mt-1 text-gray-900 font-medium">{selected.vat}%</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <p className="mt-1 text-gray-900">{selected.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Documents requis</label>
                        <p className="mt-1 text-gray-900 font-medium">
                          Facture commerciale, Liste de colisage, Certificat d'origine
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Restrictions</label>
                        <p className="mt-1 text-gray-900 font-medium">Aucune</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center space-x-4">
                      <button
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => alert(`Ajouté ${selected.code} aux favoris`)}
                      >
                        <span className="material-symbols-outlined text-base mr-2">add</span>
                        Ajouter aux favoris
                      </button>
                      <button
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
            </div>
          </main>

        </div>
      </MainLayout>
  );
}
