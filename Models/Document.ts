import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Shipment } from "./Shipment";

@Entity({ name: "document" })
export class Document {
  // PK unsigned (cohérent avec les autres tables numériques)
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 20 }) type!: string;
  @Column({ type: "varchar", length: 255 }) filename!: string;
  @Column({ type: "varchar", length: 500 }) url!: string;

  // FK qui DOIT matcher Shipment.id → int unsigned nullable
  @Column({ type: "int", unsigned: true, nullable: true })
  shipmentId!: number | null;

  @ManyToOne(() => Shipment, (s) => s.documents, { onDelete: "SET NULL", onUpdate: "CASCADE" })
  @JoinColumn({ name: "shipmentId" })
  shipment!: Shipment | null;
}
