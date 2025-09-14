// server/entities/ChatMessage.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type ChatRole = "user" | "assistant" | "system";

@Entity({ name: "chat_message" })
export class ChatMessage {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  // UUID nullable
  @Column({ type: "char", length: 36, nullable: true })
  userId!: string | null;

  @Column({ type: "varchar", length: 64 })
  sessionId!: string;

  @Column({
    type: "enum",
    enum: ["user", "assistant", "system"],
    default: "user",
  })
  role!: ChatRole;

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
