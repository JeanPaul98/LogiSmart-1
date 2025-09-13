// server/entities/TrackingEvent.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Shipment } from "./Shipment";

@Entity({ name: "tracking_event" })
export class TrackingEvent {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", unsigned: true })
  shipmentId!: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.trackingEvents, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "shipmentId" })
  shipment!: Shipment;

  @Column({ type: "varchar", length: 64 })
  status!: string;

  @Column({ type: "varchar", length: 255 })
  location!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  timestamp!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
