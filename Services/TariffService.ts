// server/services/TariffCalculator.ts
import type { TransportMode } from "../Models/Shipment";
import { AppDataSource } from "../dbContext/db";
import { Shipment } from "../Models/Shipment";
import { ShipmentTariff } from "../Models/ShipmentTCalcul";

export type TariffInput = {
  originCountry: string;
  destinationCountry: string;
  transportMode: TransportMode;
  weight: number;
  volume?: number;
  declaredValue: number;
  hsCode?: string;
  incoterm?: string;
  cargoType?: "general" | "dangerous" | "perishable" | "fragile";
  insurance?: boolean;
  packageCount?: number;
  serviceType?: "standard" | "express" | "economy";

};


export type TariffOutput = {
  totalCost: number;
  baseCost: number;
  distanceFactor: number;
  volumetricWeight?: number;
  insuranceCost?: number;
  customsDuty?: number;
  vat?: number;
  breakdown: Record<string, number | string>;
  estimatedDays: number;
};


export const calculateTariffForShipment = async (shipmentId: number) => {
  const shipmentRepo = AppDataSource.getRepository(Shipment);
  const tariffRepo = AppDataSource.getRepository(ShipmentTariff);

  const shipment = await shipmentRepo.findOneBy({ id: shipmentId });
  if (!shipment) throw new Error("Shipment not found");

  const tariffData = calculateTariff({
    originCountry: shipment.originCity,
    destinationCountry: shipment.destinationCity,
    transportMode: shipment.transportMode,
    weight: shipment.weight,
    volume: shipment.volume ?? undefined,
    declaredValue: shipment.value,
    hsCode: shipment.hsCode ?? undefined,
    insurance: true,
    serviceType: "standard",
  });

  const tariff = tariffRepo.create({
    ...tariffData,
    shipment,
    shipmentId: shipment.id,
    isEstimation: false,
  });

  return await tariffRepo.save(tariff);
};

export const createEstimation = async (input: TariffInput) => {
  const tariffRepo = AppDataSource.getRepository(ShipmentTariff);

  const tariffData = calculateTariff(input);

  const tariff = tariffRepo.create({
    ...tariffData,
    shipment: null,
    shipmentId: null,
    isEstimation: true,
  });

  return await tariffRepo.save(tariff);
};

const calculateTariff = (input: TariffInput): TariffOutput => {
  const volumetricWeight = input.volume ? input.volume * 1000 / 5000 : 0;
  const chargeableWeight = Math.max(input.weight, volumetricWeight);

  // Base cost selon mode transport
  let baseCost = 500;
  switch(input.transportMode) {
    case 'air': baseCost = chargeableWeight * 8.5; break;
    case 'sea': baseCost = chargeableWeight * 2; break;
    case 'road': baseCost = chargeableWeight * 4; break;
  }

  // Distance factor
  const distanceFactor = input.originCountry === input.destinationCountry ? 1 : 1.5;

  // Assurance
  const insuranceCost = input.insurance ? input.declaredValue * 0.01 : 0;

  // Customs Duty et VAT simplifiés
  const customsDuty = input.hsCode ? input.declaredValue * 0.05 : 0;
  const vat = input.hsCode ? input.declaredValue * 0.1 : 0;

  // Service type
  let serviceMultiplier = 1;
  if(input.serviceType === 'express') serviceMultiplier = 1.2;
  else if(input.serviceType === 'economy') serviceMultiplier = 0.9;

  const totalCost = Math.round((baseCost * distanceFactor + insuranceCost + customsDuty + vat) * serviceMultiplier * 100) / 100;

  // Estimation delivery
  let estimatedDays = 0;
  switch(input.transportMode) {
    case 'air': estimatedDays = 3; break;
    case 'sea': estimatedDays = 20; break;
    case 'road': estimatedDays = 7; break;
  }

  return {
    totalCost,
    baseCost,
    distanceFactor,
    volumetricWeight,
    insuranceCost,
    customsDuty,
    vat,
    breakdown: { 
      chargeableWeight, 
      transportMode: input.transportMode, 
      serviceType: input.serviceType ?? "standard"  // valeur par défaut
    },
    estimatedDays
  };
};
