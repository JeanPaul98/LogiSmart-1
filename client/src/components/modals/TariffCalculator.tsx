import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plane, Truck, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TariffCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const tariffSchema = z.object({
  origin: z.string().min(1, "Lieu d'enlèvement requis"),
  destination: z.string().min(1, "Lieu de livraison requis"),
  weight: z.string().min(1, "Poids requis"),
  volume: z.string().optional(),
  transportMode: z.enum(["air", "sea", "road"]),
});

type TariffForm = z.infer<typeof tariffSchema>;

export default function TariffCalculator({ isOpen, onClose }: TariffCalculatorProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedTransport, setSelectedTransport] = useState<"air" | "sea" | "road">("air");
  const [tariffResult, setTariffResult] = useState<any>(null);

  const form = useForm<TariffForm>({
    resolver: zodResolver(tariffSchema),
    defaultValues: {
      transportMode: "air",
    },
  });

  const calculateTariffMutation = useMutation({
    mutationFn: async (data: TariffForm) => {
      const response = await apiRequest('POST', '/api/calculate-tariff', {
        ...data,
        weight: parseFloat(data.weight),
        volume: data.volume ? parseFloat(data.volume) : undefined,
      });
      return response.json();
    },
    onSuccess: (result) => {
      setTariffResult(result);
    },
    onError: (error) => {
      toast({
        title: t("errors.tariff.calculation"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TariffForm) => {
    calculateTariffMutation.mutate({
      ...data,
      transportMode: selectedTransport,
    });
  };

  const transportModes = [
    { mode: "air", icon: Plane, label: t("transport.air"), color: "border-primary-600 bg-primary-50" },
    { mode: "road", icon: Truck, label: t("transport.road"), color: "border-gray-200" },
    { mode: "sea", icon: Ship, label: t("transport.sea"), color: "border-gray-200" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("tariff.calculator.title")}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Transport Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("tariff.transportMode")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {transportModes.map(({ mode, icon: Icon, label, color }) => (
                    <Button
                      key={mode}
                      type="button"
                      variant="outline"
                      className={`p-3 h-auto text-center ${
                        selectedTransport === mode ? color : "border-gray-200"
                      }`}
                      onClick={() => setSelectedTransport(mode as "air" | "sea" | "road")}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <Icon className={`w-5 h-5 ${
                          selectedTransport === mode ? "text-primary-600" : "text-gray-400"
                        }`} />
                        <span className={`text-xs font-medium ${
                          selectedTransport === mode ? "text-primary-600" : "text-gray-600"
                        }`}>
                          {label}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Origin and Destination */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("tariff.origin")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.cityDeparture")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("tariff.destination")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.cityDestination")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tariff.weight")} (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tariff.volume")} (m³)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.001" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Results */}
              {tariffResult && (
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary-800 mb-2">
                    {t("tariff.estimatedCost")}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-700">
                        {t(`transport.${tariffResult.transportMode}`)}:
                      </span>
                      <span className="font-medium text-primary-800">
                        €{tariffResult.totalCost}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-700">{t("tariff.estimatedDelivery")}:</span>
                      <span className="font-medium text-primary-800">
                        {tariffResult.estimatedDays} {t("days")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-600 text-white hover:bg-primary-700"
                disabled={calculateTariffMutation.isPending}
              >
                {calculateTariffMutation.isPending 
                  ? t("calculating") 
                  : t("tariff.calculate")
                }
              </Button>

              {tariffResult && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onClose();
                    // Navigate to create shipment with pre-filled data
                  }}
                >
                  {t("tariff.proceedWithTariff")}
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
