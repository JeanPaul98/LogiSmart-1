// server/entities/ChatSession.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "chat_session" })
export class ChatSession {
  // id: STRING(64), utilisé comme clé primaire
  @PrimaryColumn({ type: "varchar", length: 64 })
  id!: string;

  // userId: UUID → référence vers User.id
  @Column({ type: "char", length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
