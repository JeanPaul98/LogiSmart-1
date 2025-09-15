// server/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { ChatSession } from "./ChatSession";

@Entity({ name: "user" })
export class User {
  // UUID comme Sequelize (defaultValue: UUIDV4)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // ⬇⬇ le champ devient nullable, et le type TS suit: string | null
  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  firstName!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  lastName!: string | null;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  profileImageUrl!: string | null;

  @Column({ type: "varchar", length: 512, nullable: true })
  refreshToken!: string | null;

  @Column({ type: "varchar", length: 10, default: "fr" })
  preferredLanguage!: string;

  @OneToMany(() => ChatSession, (session) => session.user)
  sessions!: ChatSession[];

  // ⬇⬇ AJOUT du rôle (enum)
  @Column({
    type: "enum",
    enum: ["user", "admin", "moderator"],
    default: "user",
  })
  role!: "user" | "admin" | "moderator";


  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date | null;
}
