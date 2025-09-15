// server/entities/ShipmentTariff.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Shipment } from "./Shipment";
  
  @Entity({ name: "shipment_tariff" })
  export class ShipmentTariff {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id!: number;
  
    @Column({ type: "int", unsigned: true, nullable: true })
    shipmentId!: number | null;
  
    @OneToOne(() => Shipment, (shipment) => shipment.tariff, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      nullable: true,
    })
    @JoinColumn({ name: "shipmentId" })
    shipment!: Shipment | null;
  
    @Column({ type: "boolean", default: false })
    isEstimation!: boolean;   // ⬅️ nouveau champ
  
    @Column({ type: "decimal", precision: 12, scale: 2 })
    totalCost!: number;
  
    @Column({ type: "decimal", precision: 12, scale: 2 })
    baseCost!: number;
  
    @Column({ type: "decimal", precision: 8, scale: 2, default: 1 })
    distanceFactor!: number;
  
    @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
    volumetricWeight!: number | null;
  
    @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
    insuranceCost!: number | null;
  
    @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
    customsDuty!: number | null;
  
    @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
    vat!: number | null;
  
    @Column({ type: "int", unsigned: true })
    estimatedDays!: number;
  
    @CreateDateColumn({ type: "datetime" })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: "datetime" })
    updatedAt!: Date;
  }
  