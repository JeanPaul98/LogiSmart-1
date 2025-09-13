// server/entities/HSCode.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Transformer pour convertir DECIMAL (MySQL renvoie string) → number
const decimalToNumber = {
  to: (val?: number | null) => val,
  from: (val?: string | null) => (val == null ? null : Number(val)),
};

@Entity({ name: "hs_code" })
export class HSCode {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 32 })
  code!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: decimalToNumber,
  })
  dutyRate!: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: decimalToNumber,
  })
  vatRate!: number | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  category!: string | null;

  @Column({ type: "text", nullable: true })
  restrictions!: string | null;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
