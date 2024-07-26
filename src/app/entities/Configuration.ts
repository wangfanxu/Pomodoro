import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "work_interval" })
  workInterval!: number;

  @Column({ name: "short_break" })
  shortBreak!: number;

  @Column({ name: "long_break" })
  longBreak!: number;

  @Column({ name: "long_break_interval" })
  longBreakInterval!: number;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at" })
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.configuration)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;
}
