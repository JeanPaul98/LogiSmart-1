import {
    type InsertChatMessage,
    type ChatMessage,
  } from "@shared/schema";
  
  /**
   * Contrat de persistance pour l’application.
   * Implémentations possibles : Sequelize, mémoire, etc.
   */
  export interface IChat {
    // Chat
    addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
    getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]>;
  }
  
  export type {
    InsertChatMessage,
    ChatMessage,
  };
  