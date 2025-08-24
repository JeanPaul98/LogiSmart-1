import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Package,
  History,
  Download,
  Bell,
  TrendingUp,
  LogOut,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react";

// Typage local sûr si useAuth() n'expose pas un type fort
type MaybeUser =
  | {
      profileImageUrl?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    }
  | null
  | undefined;

export default function Dashboard() {
  // on caste localement la forme retournée pour éviter les 2339
  const { user, isAuthenticated, isLoading } = useAuth() as {
    user: MaybeUser;
    isAuthenticated: boolean;
    isLoading: boolean;
  };

  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      const id = setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return () => clearTimeout(id);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const fullName =
    (user?.firstName ?? "") + (user?.lastName ? ` ${user.lastName}` : "");
  const displayName = fullName.trim() || t("dashboard.profile.defaultName");
  const displayEmail = user?.email ?? "";

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                <p className="text-gray-600">{displayEmail}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {t("dashboard.profile.verified")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-primary-600">0</p>
              <p className="text-sm text-gray-600">
                {t("dashboard.stats.totalShipments")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">€0</p>
              <p className="text-sm text-gray-600">
                {t("dashboard.stats.totalSaved")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <History className="w-4 h-4 mr-3 text-primary-600" />
              {t("dashboard.quickActions.shipmentHistory")}
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <FileText className="w-4 h-4 mr-3 text-secondary-600" />
              {t("dashboard.quickActions.documents")}
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <Bell className="w-4 h-4 mr-3 text-amber-600" />
              <div className="flex items-center justify-between w-full">
                <span>{t("dashboard.quickActions.alerts")}</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  0
                </span>
              </div>
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <BarChart3 className="w-4 h-4 mr-3 text-blue-600" />
              {t("dashboard.quickActions.analytics")}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t("dashboard.recentActivity.empty")}</p>
              <p className="text-sm text-gray-400 mt-2">
                {t("dashboard.recentActivity.emptySubtitle")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.settings.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <Settings className="w-4 h-4 mr-3 text-gray-600" />
              {t("dashboard.settings.preferences")}
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
              <Download className="w-4 h-4 mr-3 text-gray-600" />
              {t("dashboard.settings.exportData")}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t("dashboard.settings.logout")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
