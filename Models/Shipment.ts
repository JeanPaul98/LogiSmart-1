// server/entities/Shipment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Document } from "./Document";
import { ShipmentTariff } from "./ShipmentTCalcul";
import { TrackingEvent } from "./TrackingEvent"; // ⬅️ assure-toi de cet import

// Types d'enum pour plus de sécurité côté TS
export type TransportMode = "air" | "sea" | "road";
export type ShipmentStatus =
  | "draft"
  | "confirmed"
  | "in_transit"
  | "customs_clearance"
  | "delivered"
  | "cancelled";

// (Optionnel) Transformer pour lire les DECIMAL MySQL en number JS
const decimalToNumber = {
  to: (val?: number | null) => val, // vers DB (laisse TypeORM gérer)
  from: (val?: string | null) => (val == null ? null : Number(val)),
};

@Entity({ name: "shipment" })
export class Shipment {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  trackingNumber!: string;

  // FK vers user.id (UUID stocké en CHAR(36))
  @Column({ type: "char", length: 36, nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.sessions, {
    // sessions est juste une relation dans User; pas obligatoire ici
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "userId" })
  user!: User | null;

  @Column({ type: "varchar", length: 255 })
  senderName!: string;

  @Column({ type: "varchar", length: 255 })
  senderEmail!: string;

  @Column({ type: "varchar", length: 1024 })
  senderAddress!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  senderPhone!: string | null;

  @Column({ type: "varchar", length: 255 })
  recipientName!: string;

  @Column({ type: "varchar", length: 255 })
  recipientEmail!: string;

  @Column({ type: "varchar", length: 1024 })
  recipientAddress!: string;

  @OneToOne(() => ShipmentTariff, (tariff) => tariff.shipment)
  tariff!: ShipmentTariff;


  @Column({ type: "varchar", length: 64, nullable: true })
  recipientPhone!: string | null;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: decimalToNumber,
  })
  weight!: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    nullable: true,
    transformer: decimalToNumber,
  })
  volume!: number | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  nbColis!: number | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: decimalToNumber,
  })
  value!: number;

  @Column({ type: "varchar", length: 32, nullable: true })
  hsCode!: string | null;

  @Column({
    type: "enum",
    enum: ["air", "sea", "road"],
  })
  transportMode!: TransportMode;

  @Column({ type: "varchar", length: 255 })
  originCity!: string;

  @Column({ type: "varchar", length: 255 })
  sensTransi!: string;

  @Column({ type: "varchar", length: 255 })
  destinationCity!: string;


  @Column({
    type: "enum",
    enum: ["draft", "confirmed", "in_transit", "customs_clearance", "delivered", "cancelled"],
    default: "draft",
  })
  status!: ShipmentStatus;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: decimalToNumber,
  })
  totalCost!: number | null;

  @CreateDateColumn({ type: "datetime" })
  enlevDate!: Date;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: decimalToNumber,
  })
  customsDuty!: number | null;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: decimalToNumber,
  })
  vat!: number | null;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  // Relation inverse pour Document (Document.shipmentId)
  @OneToMany(() => Document, (doc) => doc.shipment)
  documents!: Document[];

  @OneToMany(() => TrackingEvent, (event) => event.shipment)
  trackingEvents!: TrackingEvent[];
}
