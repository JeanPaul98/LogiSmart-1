import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, MapPin } from "lucide-react";
import { useLocation } from "wouter";

const createShipmentSchema = z.object({
  senderName: z.string().min(1, "Nom requis"),
  senderEmail: z.string().email("Email invalide"),
  senderAddress: z.string().min(1, "Adresse requise"),
  senderPhone: z.string().optional(),
  recipientName: z.string().min(1, "Nom requis"),
  recipientEmail: z.string().email("Email invalide"),
  recipientAddress: z.string().min(1, "Adresse requise"),
  recipientPhone: z.string().optional(),
  description: z.string().min(1, "Description requise"),
  weight: z.string().min(1, "Poids requis"),
  volume: z.string().optional(),
  value: z.string().min(1, "Valeur requise"),
  transportMode: z.enum(["air", "sea", "road"]),
  originCity: z.string().min(1, "Ville d'origine requise"),
  destinationCity: z.string().min(1, "Ville de destination requise"),
});

type CreateShipmentForm = z.infer<typeof createShipmentSchema>;

// Typage local sûr si useAuth() n'expose pas un type fort
type MaybeUser =
  | {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }
  | null
  | undefined;

export default function CreateShipment() {
  const { user } = useAuth() as { user: MaybeUser };
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Valeurs par défaut sûres (toujours des strings)
  const defaultSenderName =
    (user?.firstName ?? "") + (user?.lastName ? ` ${user.lastName}` : "");
  const defaultSenderEmail = user?.email ?? "";

  const form = useForm<CreateShipmentForm>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      senderName: defaultSenderName,
      senderEmail: defaultSenderEmail,
      senderAddress: "",
      senderPhone: "",
      recipientName: "",
      recipientEmail: "",
      recipientAddress: "",
      recipientPhone: "",
      description: "",
      weight: "",
      volume: "",
      value: "",
      transportMode: "air",
      originCity: "",
      destinationCity: "",
    },
  });

  const createShipmentMutation = useMutation({
    mutationFn: async (data: CreateShipmentForm) => {
      const response = await apiRequest("POST", "/api/shipments", {
        ...data,
        weight: parseFloat(data.weight),
        volume: data.volume ? parseFloat(data.volume) : null,
        value: parseFloat(data.value),
      });
      return response.json();
    },
    onSuccess: (shipment: { trackingNumber: string }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/shipments"] });
      toast({
        title: t("shipment.created.title"),
        description: `${t("shipment.created.description")} ${shipment.trackingNumber}`,
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: t("errors.shipment.create"),
        // ⬇️ remplace "errors.generic" par un fallback existant
        description: error?.message ?? t("errors.shipment.create"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateShipmentForm) => {
    createShipmentMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("shipment.create.title")}</h1>
          <p className="text-gray-600 mt-2">{t("shipment.create.subtitle")}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary-600" />
                  <span>{t("shipment.sender.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.sender.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.fullName")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.sender.email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("placeholders.email")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.sender.address")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("placeholders.address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("shipment.sender.phone")} ({t("optional")})
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.phone")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-secondary-600" />
                  <span>{t("shipment.recipient.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.recipient.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.fullName")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.recipient.email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("placeholders.email")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.recipient.address")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("placeholders.address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("shipment.recipient.phone")} ({t("optional")})
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.phone")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Package Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span>{t("shipment.package.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.package.description")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("placeholders.description")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shipment.package.weight")} (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shipment.package.value")} (€)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("shipment.package.volume")} (m³) ({t("optional")})
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Transport Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("shipment.transport.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="transportMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shipment.transport.mode")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("placeholders.selectTransport")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="air">
                            {t("transport.air")} - 3-5 {t("days")}
                          </SelectItem>
                          <SelectItem value="sea">
                            {t("transport.sea")} - 15-25 {t("days")}
                          </SelectItem>
                          <SelectItem value="road">
                            {t("transport.road")} - 7-10 {t("days")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shipment.transport.origin")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("placeholders.city")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("shipment.transport.destination")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("placeholders.city")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={createShipmentMutation.isPending}
            >
              {createShipmentMutation.isPending ? t("creating") : t("shipment.create.button")}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-500">{t("shipment.create.footer")}</span>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
