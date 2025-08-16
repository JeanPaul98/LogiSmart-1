import { Truck, Calculator, Package, Search, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Calculator,
      title: t("features.tariff.title"),
      description: t("features.tariff.description"),
      color: "bg-primary-100 text-primary-600"
    },
    {
      icon: Package,
      title: t("features.tracking.title"),
      description: t("features.tracking.description"),
      color: "bg-secondary-100 text-secondary-600"
    },
    {
      icon: Search,
      title: t("features.hsCode.title"),
      description: t("features.hsCode.description"),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: MessageSquare,
      title: t("features.chatbot.title"),
      description: t("features.chatbot.description"),
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: TrendingUp,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white px-6 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Truck className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">LogiSmart</h1>
          <p className="text-lg text-white/90 mb-8">
            {t("landing.subtitle")}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full bg-white text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t("auth.login")}
            </Button>
            <Button
              onClick={() => window.location.href = '/api/login'}
              variant="outline"
              className="w-full border-white/30 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              {t("auth.register")}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-gray-600">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-8 bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t("landing.ctaTitle")}
          </h3>
          <p className="text-gray-600 mb-6">
            {t("landing.ctaSubtitle")}
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {t("landing.getStarted")}
          </Button>
        </div>
      </div>
    </div>
  );
}
