import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Session } from "./Session";

@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  completed!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Session, (session) => session)
  sessions!: Session[];

  @ManyToOne(() => User, (user) => user.cycles)
  user!: User;
}
