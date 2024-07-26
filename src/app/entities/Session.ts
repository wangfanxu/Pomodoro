import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "start_time", type: "timestamp", nullable: true })
  startTime!: Date | null;

  @Column({ name: "end_time", type: "timestamp", nullable: true })
  endTime!: Date | null;

  @Column({ name: "duration", type: "int", nullable: false })
  duration!: number;

  @Column({
    type: "enum",
    enum: ["pending", "in_progress", "paused", "completed"],
    default: "pending",
  })
  status!: "pending" | "in_progress" | "paused" | "completed";

  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;
}
