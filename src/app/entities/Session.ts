import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Cycle } from "./Cycle";

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
    nullable: false,
  })
  status!: "pending" | "in_progress" | "paused" | "completed";

  @Column({
    type: "enum",
    enum: ["work", "shortBreak", "longBreak"],
  })
  type!: "work" | "shortBreak" | "longBreak";

  @ManyToOne(() => Cycle, (cycle) => cycle.sessions)
  cycle!: Cycle;

  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;
}
