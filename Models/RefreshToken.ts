import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, Index
} from "typeorm";
import { User } from "./User";

@Entity({ name: "refresh_token" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.refreshTokens, { onDelete: "CASCADE" })
  user!: User;

  @Index()
  @Column({ type: "varchar", length: 512 })
  token!: string;

  @Column({ type: "boolean", default: false })
  revoked!: boolean;

  @Column({ type: "datetime" })
  expiresAt!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
