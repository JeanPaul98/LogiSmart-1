// server/entities/Alert.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity({ name: "alert" })
export class Alert {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Index()
  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 64 })
  type!: string;

  // MySQL 5.7+ : colonne JSON (table existante: DataTypes.JSON)
  @Column({ type: "json", nullable: true })
  affectedCountries!: string[] | null;

  @Column({ type: "json", nullable: true })
  affectedProducts!: string[] | null;

  @Column({ type: "datetime", nullable: true })
  effectiveDate!: Date | null;

  // Sequelize BOOLEAN => MySQL TINYINT(1) – TypeORM "boolean" convient
  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  // Conserve les timestamps camelCase (createdAt / updatedAt)
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
