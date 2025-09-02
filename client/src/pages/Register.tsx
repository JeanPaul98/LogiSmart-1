import { useState } from "react";
import { Link, useLocation } from "wouter";
import favicon from '../../public/favicon.png';

export default function Register() {
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Compte créé avec succès ✅ Redirection…");
        setTimeout(() => setLocation("/api/login"), 800);
      } else {
        setSuccess(false);
        setMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setSuccess(false);
      setMessage("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      {/* >>> même conteneur que Login <<< */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl w-full">
        {/* Colonne gauche (branding / visuel) — même carte blanche que Login */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-800">Votre Application</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Créez votre compte</h1>
            <p className="text-gray-600 mb-8">
              Rejoignez-nous pour une expérience élégante, sécurisée et rapide. Vos informations sont protégées.
            </p>
          </div>

          <div>

            {/*<img
              alt="Abstract colorful background"
              className="rounded-2xl w-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZcvstQ1KNILwiQRXCkUXuxw1WlkbM0jXP-WxwD9LYLID43ptk5mW-hTUaOMgur2_DqsAQD9T0aurgxSWbRF8LEOAebKKAYW3jPmT71Ay0sQl14-3JAIbsMRsVKlPdv60CB0_N8cUxG-Zk-yhExVfSUL0JC567xeEJEDNEmUK8xuyLjjOYQh60VPnj3VkvL2oRuCyTM1JwZQDpkZw8MVXC31e3gAij4O2AtxVik1PyVAJ9tp7JjDB__UWtr2HJgJA-aznP9L_E8UJ"
            />*/}
            <p className="text-center text-sm text-gray-500 mt-4">
              Aucune publicité. Contrôle total sur vos données.
            </p>
          </div>
        </div>

        {/* Colonne droite (formulaire) — mêmes proportions et style que Login */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          {/* Onglets */}
          <div className="bg-gray-100 p-1 rounded-lg flex mb-8">
            <Link
              href="/"
              className="w-1/2 text-center text-gray-500 py-2.5 rounded-md font-semibold hover:text-gray-700"
            >
              Connexion
            </Link>
            <button
              type="button"
              className="w-1/2 bg-white text-gray-800 py-2.5 rounded-md font-semibold shadow-sm"
              aria-current="page"
            >
              Enregistrement
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prenom">
                Prénom
              </label>
              <input
                id="prenom"
                name="firstName"
                type="text"
                placeholder="Jean"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="given-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="nom">
                Nom
              </label>
              <input
                id="nom"
                name="lastName"
                type="text"
                placeholder="Dupont"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="family-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jean.dupont@exemple.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="new-password"
              />
            </div>

            <p className="text-xs text-gray-500 -mt-2">
              En vous inscrivant, vous acceptez les{" "}
              <a className="text-indigo-600 font-medium" href="#">
                Conditions
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              {loading ? "Création du compte…" : "Créer le compte"}
            </button>
          </form>

          {/* Message de statut */}
          {message && (
            <div
              className={`mt-4 text-center p-3 rounded-lg font-medium ${
                success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Séparateur */}
          <div className="flex items-center my-6">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">ou continuez avec</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Boutons sociaux (placeholders) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert("Inscription Google — à implémenter")}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <img
                alt="Google logo"
                className="h-5 w-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHb161zksTtmHrshUd2DyhcfmsE7iOVSbvdEFZcQxq4WDAkLmj1CFno08Q2X__klJzNcqirTLX7idKFJMyeCS8bMmKHjKZXcrGd6YcWxQSmuJm5pHvi60uFv5EBbeskSdlcDmMxaZXevSnrwY3ka_7x1f_QbN7NGY7qmVrngWZpLm6wxaxMjxGlzPONa3khScZhH1HdbdxdaxN-em2MFkDdaXsbWaEWuoXTMTSETBjmQZ0Es1-JcbFytY1UueO4OddkwzaQXf6NKi7"
              />
              Google
            </button>

            <button
              type="button"
              onClick={() => alert("Inscription Facebook — à implémenter")}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <img
                alt="Facebook logo"
                className="h-5 w-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_U4YiJSVD9ky0M0qYR3YEmrNV_UXTiMleZPbWK48Z0ZOMUGOxnXsLoT7zhDbtxXxGQYuncd3x-S5ibXZF7xhZTTl-WjoAGQPjjvilw9GJ5aZsPrH5zE2xP9nI4znrkwcaZOMJrV2SNar984LC-NQwLrcnT_YGXg-BiPIVaXrJeuh-PKY-SKc3rVganKb6fShNWISwsqIJGAuVHEGVQ3gjYn_OCpFe4rzKNfwePFNKm0Hy9x4KbCrbLsRwebKTDyRJ25JAA5lmFPBF"
              />
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
