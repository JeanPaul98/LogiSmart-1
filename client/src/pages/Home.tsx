import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import QuickTracking from "@/components/QuickTracking";
import QuickActions from "@/components/QuickActions";
import RecentShipments from "@/components/RecentShipments";
import { AlertTriangle } from "lucide-react";

// Typage local sûr si useAuth() n'expose pas un type fort
type MaybeUser =
  | {
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      profileImageUrl?: string | null;
    }
  | null
  | undefined;

export default function Home() {
  // on caste la forme retournée pour éviter les erreurs 2339
  const { user } = useAuth() as { user: MaybeUser };
  const { t } = useLanguage();

  const greetingName = (user?.firstName ?? "Utilisateur").toString();

  // Forcer t(...) en string lorsqu'on l'insère dans le JSX texte
  const welcomeTitle = user
    ? String(t("welcome.authenticated", { name: greetingName }))
    : String(t("welcome.guest"));
  const welcomeSubtitle = String(t("welcome.subtitle"));
  const alertsTitle = String(t("alerts.title"));
  const alertsExample = String(t("alerts.example"));
  const alertsLearnMore = String(t("alerts.learnMore"));

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-6">
        <div className="text-center">
          <h2 className="text-lg font-medium">{welcomeTitle}</h2>
          <p className="text-white/80 text-sm mt-1">{welcomeSubtitle}</p>
        </div>
      </section>

      {/* Quick Tracking */}
      <QuickTracking />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Shipments */}
      {user && <RecentShipments />}

      {/* Regulatory Alerts */}
      <section className="px-4 py-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
            <div>
              <h4 className="font-medium text-amber-800">{alertsTitle}</h4>
              <p className="text-sm text-amber-700 mt-1">{alertsExample}</p>
              <button
                type="button"
                className="text-amber-800 text-sm font-medium mt-2 hover:underline"
              >
                {alertsLearnMore} →
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
