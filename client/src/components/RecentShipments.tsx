import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import type { Shipment } from "@shared/schema";

export default function RecentShipments() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: shipments = [], isLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  if (isLoading) {
    return (
      <section className="px-4 py-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t("shipments.recent.title")}</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 w-10 h-10 rounded-lg"></div>
                  <div>
                    <div className="bg-gray-200 h-4 w-20 rounded mb-1"></div>
                    <div className="bg-gray-200 h-3 w-16 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const recentShipments = shipments.slice(0, 3);

  return (
    <section className="px-4 py-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t("shipments.recent.title")}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="text-primary-600 text-sm font-medium"
        >
          {t("shipments.recent.viewAll")}
        </Button>
      </div>

      {recentShipments.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t("shipments.recent.empty")}</p>
          <p className="text-sm text-gray-400 mt-2">{t("shipments.recent.emptySubtitle")}</p>
          <Button
            onClick={() => setLocation("/create")}
            className="mt-4 bg-primary-600 text-white hover:bg-primary-700"
          >
            {t("shipments.recent.createFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentShipments.map((shipment) => {
            const statusColor = 
              shipment.status === "delivered" ? "bg-green-100 text-green-800" :
              shipment.status === "in_transit" ? "bg-blue-100 text-blue-800" :
              shipment.status === "customs_clearance" ? "bg-amber-100 text-amber-800" :
              "bg-gray-100 text-gray-800";

            const statusText = t(`shipmentStatus.${shipment.status}`);

            return (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigate to shipment details or open tracking modal
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{shipment.trackingNumber}</p>
                    <p className="text-gray-500 text-xs">
                      {shipment.originCity} → {shipment.destinationCity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                    {statusText}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
