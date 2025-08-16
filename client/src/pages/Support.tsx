import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import AIChatbot from "@/components/modals/AIChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle, 
  FileText,
  Clock,
  MapPin,
  Globe
} from "lucide-react";

export default function Support() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showChatbot, setShowChatbot] = useState(false);

  const faqItems = [
    {
      question: t("support.faq.tracking.question"),
      answer: t("support.faq.tracking.answer")
    },
    {
      question: t("support.faq.costs.question"),
      answer: t("support.faq.costs.answer")
    },
    {
      question: t("support.faq.documents.question"),
      answer: t("support.faq.documents.answer")
    },
    {
      question: t("support.faq.delivery.question"),
      answer: t("support.faq.delivery.answer")
    }
  ];

  const contactMethods = [
    {
      icon: MessageSquare,
      title: t("support.contact.chat.title"),
      description: t("support.contact.chat.description"),
      action: () => setShowChatbot(true),
      color: "bg-primary-100 text-primary-600",
      available: true
    },
    {
      icon: Phone,
      title: t("support.contact.phone.title"),
      description: t("support.contact.phone.description"),
      action: () => {},
      color: "bg-green-100 text-green-600",
      available: true
    },
    {
      icon: Mail,
      title: t("support.contact.email.title"),
      description: t("support.contact.email.description"),
      action: () => {},
      color: "bg-blue-100 text-blue-600",
      available: true
    }
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("support.title")}</h1>
          <p className="text-gray-600 mt-2">{t("support.subtitle")}</p>
        </div>

        {/* Contact Methods */}
        <Card>
          <CardHeader>
            <CardTitle>{t("support.contact.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 h-auto justify-start"
                  onClick={method.action}
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      {method.available && (
                        <span className="text-xs text-green-600 font-medium">
                          {t("support.contact.available")}
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <span>{t("support.hours.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("support.hours.weekdays")}</span>
              <span className="font-medium">08:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("support.hours.saturday")}</span>
              <span className="font-medium">09:00 - 15:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("support.hours.sunday")}</span>
              <span className="font-medium text-red-600">{t("support.hours.closed")}</span>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-secondary-600" />
              <span>{t("support.faq.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 p-3 text-sm text-gray-600 bg-white border-l-2 border-primary-200">
                  {item.answer}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        {/* Office Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>{t("support.office.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{t("support.office.headquarters")}</p>
              <p className="text-sm text-gray-600">
                123 Avenue des Champs-Élysées<br />
                75008 Paris, France
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{t("support.office.regional")}</p>
              <p className="text-sm text-gray-600">
                Dakar, Abidjan, Casablanca<br />
                {t("support.office.regionalDesc")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>{t("support.resources.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-3 text-blue-600" />
              {t("support.resources.userGuide")}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3 text-green-600" />
              {t("support.resources.customsGuide")}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-3 text-purple-600" />
              {t("support.resources.tutorials")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <AIChatbot 
          isOpen={showChatbot} 
          onClose={() => setShowChatbot(false)}
        />
      )}
    </Layout>
  );
}
