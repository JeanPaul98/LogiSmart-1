import { useState } from "react";
import { Calculator, Plus, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import TariffCalculator from "./modals/TariffCalculator";
import HSCodeSearch from "./modals/HSCodeSearch";
import AIChatbot from "./modals/AIChatbot";
import { useLocation } from "wouter";

export default function QuickActions() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showTariffCalculator, setShowTariffCalculator] = useState(false);
  const [showHSCodeSearch, setShowHSCodeSearch] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const actions = [
    {
      icon: Calculator,
      label: t("actions.getTariff"),
      color: "bg-primary-100 text-primary-600",
      onClick: () => setShowTariffCalculator(true),
    },
    {
      icon: Plus,
      label: t("actions.createShipment"),
      color: "bg-secondary-100 text-secondary-600",
      onClick: () => setLocation("/create"),
    },
    {
      icon: Search,
      label: t("actions.hsCode"),
      color: "bg-green-100 text-green-600",
      onClick: () => setShowHSCodeSearch(true),
    },
    {
      icon: MessageSquare,
      label: t("actions.aiAssistant"),
      color: "bg-orange-100 text-orange-600",
      onClick: () => setShowChatbot(true),
    },
  ];

  return (
    <>
      <section className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">{t("actions.title")}</h3>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center h-auto"
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      {showTariffCalculator && (
        <TariffCalculator
          isOpen={showTariffCalculator}
          onClose={() => setShowTariffCalculator(false)}
        />
      )}

      {showHSCodeSearch && (
        <HSCodeSearch
          isOpen={showHSCodeSearch}
          onClose={() => setShowHSCodeSearch(false)}
        />
      )}

      {showChatbot && (
        <AIChatbot
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </>
  );
}
