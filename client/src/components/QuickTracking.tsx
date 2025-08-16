import { useState } from "react";
import { Search, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import PackageTracking from "./modals/PackageTracking";

export default function QuickTracking() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: t("errors.tracking.empty"),
        description: t("errors.tracking.emptyDesc"),
        variant: "destructive",
      });
      return;
    }
    setShowTracking(true);
  };

  const handleQRScan = () => {
    // Simulate QR scan
    toast({
      title: t("qr.scanSimulated"),
      description: t("qr.scanSimulatedDesc"),
    });
  };

  return (
    <>
      <section className="px-4 py-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t("tracking.quick.title")}</h3>
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("tracking.quick.placeholder")}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQRScan}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 p-1"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={handleTrack}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            {t("tracking.quick.button")}
          </Button>
        </div>
      </section>

      {showTracking && (
        <PackageTracking
          isOpen={showTracking}
          onClose={() => setShowTracking(false)}
          trackingNumber={trackingNumber}
        />
      )}
    </>
  );
}
