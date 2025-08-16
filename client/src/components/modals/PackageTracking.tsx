import { useQuery } from "@tanstack/react-query";
import { X, MapPin, Download, FileText, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface PackageTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
}

export default function PackageTracking({ 
  isOpen, 
  onClose, 
  trackingNumber 
}: PackageTrackingProps) {
  const { t, language } = useLanguage();

  const { data: trackingData, isLoading, error } = useQuery({
    queryKey: [`/api/tracking/${trackingNumber}`],
    enabled: isOpen && !!trackingNumber,
  });

  if (!isOpen) return null;

  const locale = language === 'fr' ? fr : enUS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("tracking.title")}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("tracking.loading")}</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{t("tracking.notFound")}</p>
              <p className="text-sm text-gray-500">{t("tracking.notFoundDesc")}</p>
            </div>
          )}

          {trackingData && (
            <>
              {/* Package Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{trackingData.shipment.trackingNumber}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trackingData.shipment.status === "delivered" ? "bg-green-100 text-green-800" :
                    trackingData.shipment.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                    trackingData.shipment.status === "customs_clearance" ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {t(`shipmentStatus.${trackingData.shipment.status}`)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {trackingData.shipment.originCity} → {trackingData.shipment.destinationCity}
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{t("tracking.mapPlaceholder")}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">{t("tracking.timeline.title")}</h4>
                
                {trackingData.trackingEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {t("tracking.timeline.empty")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {trackingData.trackingEvents.map((event: any, index: number) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          index === 0 ? "bg-green-500" : "bg-gray-300"
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.status}</p>
                          <p className="text-gray-500 text-xs">{event.location}</p>
                          <p className="text-gray-400 text-xs">
                            {formatDistanceToNow(new Date(event.timestamp), { 
                              addSuffix: true, 
                              locale 
                            })}
                          </p>
                          {event.description && (
                            <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents */}
              {trackingData.documents.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-3">{t("tracking.documents.title")}</h4>
                  <div className="space-y-2">
                    {trackingData.documents.map((document: any) => (
                      <Button
                        key={document.id}
                        variant="outline"
                        className="w-full justify-between p-3"
                        onClick={() => window.open(document.url, "_blank")}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{document.filename}</span>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature Section */}
              {trackingData.shipment.status === "delivered" && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-3">{t("tracking.signature.title")}</h4>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center">
                      <PenTool className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t("tracking.signature.placeholder")}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-secondary-600 text-white mt-3 hover:bg-secondary-700">
                    {t("tracking.signature.confirm")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
