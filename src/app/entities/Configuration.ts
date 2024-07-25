import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Session } from "./Session";
import { User } from "./User";

@Entity()
export class Configurations {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  workInterval!: number;

  @Column()
  shortBreak!: number;

  @Column()
  longBreak!: number;

  @Column()
  longBreakInterval!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.configuration)
  user!: User;
}
