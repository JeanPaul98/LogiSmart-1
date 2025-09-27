import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Document } from "./Document";
import { TrackingEvent } from "./TrackingEvent";

@Entity({ name: "shipment" })
export class Shipment {
  // Aligner avec la FK : int unsigned
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 64 })  trackingNumber!: string;

  @Column({ type: "varchar", length: 255 }) senderName!: string;
  @Column({ type: "varchar", length: 255 }) senderEmail!: string;
  @Column({ type: "varchar", length: 255 }) senderAddress!: string;
  @Column({ type: "varchar", length: 50  }) senderPhone!: string;

  @Column({ type: "varchar", length: 255 }) recipientName!: string;
  @Column({ type: "varchar", length: 255 }) recipientEmail!: string;
  @Column({ type: "varchar", length: 255 }) recipientAddress!: string;
  @Column({ type: "varchar", length: 50  }) recipientPhone!: string;

  @Column({ type: "text" }) description!: string;
  @Column({ type: "varchar", length: 20 }) sensTransi!: string;

  @Column({ type: "float", default: 0 }) weight!: number;
  @Column({ type: "float", nullable: true }) volume!: number | null;
  @Column({ type: "float", default: 0 }) value!: number;
  @Column({ type: "int", default: 0 }) nbColis!: number;
  @Column({ type: "varchar", length: 50, nullable: true }) hsCode!: string | null;

  @Column({ type: "datetime", nullable: true }) enlevDate!: Date | null;
  @Column({ type: "varchar", length: 20 }) transportMode!: string;
  @Column({ type: "varchar", length: 100 }) originCity!: string;
  @Column({ type: "varchar", length: 100 }) destinationCity!: string;

  @Column({ type: "varchar", length: 30, default: "draft" })
  status!: "draft" | "registered" | "confirmed" | "in_transit" | "customs_clearance" | "delivered" | "cancelled";

  @Column({ type: "float", default: 0 }) totalCost!: number;
  @Column({ type: "float", nullable: true }) customsDuty!: number | null;
  @Column({ type: "float", nullable: true }) vat!: number | null;

  @OneToMany(() => TrackingEvent, (event) => event.shipment)
  trackingEvents!: TrackingEvent[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  @OneToMany(() => Document, (d) => d.shipment)
  documents!: Document[];
}
