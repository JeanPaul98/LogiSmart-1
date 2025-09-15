// src/server/storage.typeorm.alert.ts
import { AppDataSource } from "../dbContext/db";
import { Alert as RegulatoryAlertEntity } from "../Models/Alert";
import { type RegulatoryAlert, type InsertRegulatoryAlert } from "@shared/schema";
import { IAlerts } from "../Interface/IAlerts";

/**
 * Service TypeORM pour la gestion des Regulatory Alerts (alertes réglementaires).
 * Implémente l’interface IAlerts.
 */
export class AlertService implements IAlerts {

  /**
   * Récupère les alertes actives.
   *
   * Logique métier :
   * - Sélectionne uniquement les enregistrements dont `isActive = true`.
   * - Trie par date de création (`createdAt`) décroissante → les plus récentes en premier.
   * - Limite à 10 résultats pour ne pas surcharger l’API.
   *
   * Cas d’usage :
   * - Afficher les 10 dernières alertes réglementaires actives dans le tableau de bord.
   * - Notifier les utilisateurs des alertes toujours valides.
   */
  async getActiveAlerts(): Promise<RegulatoryAlert[]> {
    const repo = AppDataSource.getRepository(RegulatoryAlertEntity);
    const rows = await repo.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      take: 10,
    });
    return rows as unknown as RegulatoryAlert[];
  }

  /**
   * Crée une nouvelle alerte réglementaire.
   *
   * Logique métier :
   * - Reçoit un DTO validé (InsertRegulatoryAlert) depuis la couche API.
   * - Génère et persiste une nouvelle entrée dans la table `alert`.
   * - Par défaut, `isActive = true` sauf si explicitement désactivée.
   *
   * Cas d’usage :
   * - Permettre aux administrateurs de publier de nouvelles restrictions ou alertes.
   */
  async createAlert(data: InsertRegulatoryAlert): Promise<RegulatoryAlert> {
    const repo = AppDataSource.getRepository(RegulatoryAlertEntity);
    const entity = repo.create({ ...data });
    const saved = await repo.save(entity);
    return saved as unknown as RegulatoryAlert;
  }

  /**
   * Désactive une alerte existante (soft update).
   *
   * Logique métier :
   * - On ne supprime pas l’alerte (traçabilité).
   * - On change uniquement `isActive = false`.
   *
   * Cas d’usage :
   * - Retirer une alerte qui n’est plus pertinente ou qui a expiré.
   */
  async deactivateAlert(id: number): Promise<void> {
    const repo = AppDataSource.getRepository(RegulatoryAlertEntity);
    await repo.update({ id }, { isActive: false });
  }

  /**
   * Récupère une alerte par son identifiant.
   *
   * Cas d’usage :
   * - Consultation détaillée d’une alerte spécifique (ex. page détail).
   */
  async getAlertById(id: number): Promise<RegulatoryAlert | undefined> {
    const repo = AppDataSource.getRepository(RegulatoryAlertEntity);
    const row = await repo.findOne({ where: { id } });
    return row as unknown as RegulatoryAlert | undefined;
  }
}

export const alertService = new AlertService();
