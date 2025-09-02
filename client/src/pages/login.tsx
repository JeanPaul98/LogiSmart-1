import { useState } from "react";
import { Link, useLocation } from "wouter";
import { navigate } from "wouter/use-browser-location";

export default function Login() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Connexion réussie ✅");
        localStorage.setItem("accessToken", data.accessToken);
        setTimeout(() => setLocation("dashboard"), 300);
      } else {
        setSuccess(false);
        setMessage(data.message || "Erreur de connexion");
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl w-full">
        {/* Colonne gauche (branding / visuel) */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm8.293-11.293l-2.293 2.293A8.964 8.964 0 0119 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.94 0 3.74.62 5.21 1.67l2.29-2.29A10.953 10.953 0 0012 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11c0-2.396-.76-4.63-2.097-6.586z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-800">Votre Application</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue</h1>
            <p className="text-gray-600 mb-8">
              Une expérience fluide et moderne pour vous connecter et démarrer rapidement.
              Conçue pour la clarté, la simplicité et l&apos;élégance.
            </p>
          </div>

          <div>
           {/*<img
              alt="Abstract colorful background"
              className="rounded-2xl w-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZcvstQ1KNILwiQRXCkUXuxw1WlkbM0jXP-WxwD9LYLID43ptk5mW-hTUaOMgur2_DqsAQD9T0aurgxSWbRF8LEOAebKKAYW3jPmT71Ay0sQl14-3JAIbsMRsVKlPdv60CB0_N8cUxG-Zk-yhExVfSUL0JC567xeEJEDNEmUK8xuyLjjOYQh60VPnj3VkvL2oRuCyTM1JwZQDpkZw8MVXC31e3gAij4O2AtxVik1PyVAJ9tp7JjDB__UWtr2HJgJA-aznP9L_E8UJ"
            />*/}
            <p className="text-center text-sm text-gray-500 mt-4">
              Sécurité renforcée. Vos données restent privées.
            </p>
          </div>
        </div>

        {/* Colonne droite (formulaire) */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          {/* Onglets Connexion / Enregistrement */}
          <div className="bg-gray-100 p-1 rounded-lg flex mb-8">
            <button
              className="w-1/2 bg-white text-gray-800 py-2.5 rounded-md font-semibold shadow-sm"
              // Optionnel : si tu veux recharger la même page, tu peux ajouter un onClick
            >
              Connexion
            </button>
            <Link
              href="/register"
              className="w-1/2 text-center text-gray-500 py-2.5 rounded-md font-semibold hover:text-gray-700"
            >
              Enregistrement
            </Link>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email ou nom d&apos;utilisateur
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nom@domaine.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <p className="text-gray-600">Restez connecté</p>
                {/* Si tu veux vraiment une case à cocher: 
                <input type="checkbox" className="ml-2" /> */}
              </div>
              <a className="font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Messages de statut */}
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
            <span className="px-2 text-gray-500 text-sm">ou</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Boutons sociaux (placeholder) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert("Connexion Google (à implémenter)")}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                height="48px"
                viewBox="0 0 48 48"
                width="48px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#fbc02d"
                ></path>
                <path
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  fill="#e53935"
                ></path>
                <path
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"
                  fill="#4caf50"
                ></path>
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238	C42.018,35.474,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#1565c0"
                ></path>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => alert("Connexion Facebook (à implémenter)")}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-blue-800"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-1.5c-1.1,0-1.5,0.45-1.5,1.4v2.1h3l-0.5,3H13v6.8C18.56,20.87,22,16.84,22,12z"></path>
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Nouveau ici ?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Créez un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
