import type { Response, Request } from "express";
import { createServer, type Server } from "http";
import { chatService } from "../Services/ChatService";



  // Chat routes
  export const chat = async (req: any, res:Response) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, content } = req.body;

      // Add user message
      const userMessage = await chatService.addChatMessage({
        userId,
        sessionId,
        role: 'user',
        content,
      });

      // Generate AI response (simplified)
      let aiResponse = "Je suis désolé, je ne peux pas traiter votre demande pour le moment. Veuillez contacter notre service client.";

      if (content.toLowerCase().includes('taxe') || content.toLowerCase().includes('tax')) {
        aiResponse = "Les taxes d'importation varient selon le produit et le pays d'origine. Pour obtenir des informations précises, veuillez utiliser notre recherche de codes HS ou fournir plus de détails sur votre marchandise.";
      } else if (content.toLowerCase().includes('délai') || content.toLowerCase().includes('time')) {
        aiResponse = "Les délais de dédouanement varient selon le mode de transport et la destination :\n• Aérien : 3-5 jours\n• Maritime : 15-25 jours\n• Routier : 7-10 jours";
      } else if (content.toLowerCase().includes('document')) {
        aiResponse = "Les documents requis pour l'importation incluent généralement :\n• Facture commerciale\n• Déclaration en douane\n• Certificat d'origine\n• Documents spécifiques selon le produit (CE, sanitaire, etc.)";
      }

      // Add AI response
      const assistantMessage = await chatService.addChatMessage({
        userId,
        sessionId,
        role: 'assistant',
        content: aiResponse,
      });

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process chat" });
    }
  };

