import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import QuickTracking from "@/components/QuickTracking";
import QuickActions from "@/components/QuickActions";
import RecentShipments from "@/components/RecentShipments";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-6">
        <div className="text-center">
          <h2 className="text-lg font-medium">
            {user ? t("welcome.authenticated", { name: user.firstName || "Utilisateur" }) : t("welcome.guest")}
          </h2>
          <p className="text-white/80 text-sm mt-1">{t("welcome.subtitle")}</p>
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
              <h4 className="font-medium text-amber-800">{t("alerts.title")}</h4>
              <p className="text-sm text-amber-700 mt-1">
                {t("alerts.example")}
              </p>
              <button className="text-amber-800 text-sm font-medium mt-2 hover:underline">
                {t("alerts.learnMore")} →
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
