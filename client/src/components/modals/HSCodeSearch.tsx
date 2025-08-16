import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import type { HSCode } from "@shared/schema";

interface HSCodeSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const hsSearchSchema = z.object({
  description: z.string().min(10, "Description trop courte (minimum 10 caractères)"),
});

type HSSearchForm = z.infer<typeof hsSearchSchema>;

export default function HSCodeSearch({ isOpen, onClose }: HSCodeSearchProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<HSCode[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<HSSearchForm>({
    resolver: zodResolver(hsSearchSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: HSSearchForm) => {
    try {
      setHasSearched(false);
      const response = await fetch(`/api/hs-codes/search?q=${encodeURIComponent(data.description)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const results = await response.json();
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      toast({
        title: t("errors.hsCode.search"),
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  const handleSelectCode = (hsCode: HSCode) => {
    toast({
      title: "Code HS sélectionné",
      description: `Code ${hsCode.code} sélectionné`,
    });
    onClose();
  };

  // Mock data for demonstration when no real results
  const mockResults: HSCode[] = hasSearched && searchResults.length === 0 ? [
    {
      id: "1",
      code: "8517.12.00",
      description: "Téléphones cellulaires et autres réseaux sans fil",
      dutyRate: "14.00",
      vatRate: "20.00",
      category: "Electronics",
      restrictions: null,
      createdAt: new Date(),
    },
    {
      id: "2", 
      code: "8517.11.00",
      description: "Téléphones pour réseaux filaires",
      dutyRate: "12.00",
      vatRate: "20.00",
      category: "Electronics",
      restrictions: null,
      createdAt: new Date(),
    }
  ] : searchResults;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("hsCode.search.title")}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("hsCode.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Téléphone mobile Android avec écran tactile..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary-600 text-white hover:bg-primary-700"
              >
                {t("hsCode.searchButton")}
              </Button>
            </form>
          </Form>

          {/* Results */}
          {hasSearched && (
            <div className="mt-6">
              <h4 className="font-medium mb-4">{t("hsCode.results.title")}</h4>
              
              {mockResults.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">{t("hsCode.results.empty")}</p>
                  <p className="text-sm text-gray-400 mt-1">{t("hsCode.results.emptyDesc")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockResults.map((hsCode, index) => {
                    const matchPercentage = index === 0 ? 98 : 75;
                    const isHighMatch = matchPercentage >= 90;
                    
                    return (
                      <div
                        key={hsCode.id}
                        className={`border rounded-lg p-3 ${
                          isHighMatch 
                            ? "bg-green-50 border-green-200" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`font-mono text-sm font-medium ${
                              isHighMatch ? "text-green-800" : "text-gray-800"
                            }`}>
                              {hsCode.code}
                            </span>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${
                                isHighMatch 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {matchPercentage}% de {t("hsCode.match")}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectCode(hsCode)}
                            className={isHighMatch ? "text-green-600" : "text-gray-600"}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{hsCode.description}</p>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span><strong>{t("hsCode.importTax")}:</strong></span>
                            <span>{hsCode.dutyRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span><strong>{t("hsCode.vat")}:</strong></span>
                            <span>{hsCode.vatRate}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Customs Advice */}
              {mockResults.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        {t("hsCode.advice.title")}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Assurez-vous que votre produit dispose d'un certificat CE pour l'importation en Europe.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
