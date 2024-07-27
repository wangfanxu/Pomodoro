import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Configuration } from "./Configuration";
import { Cycle } from "./Cycle";
import { Session } from "./Session";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  username!: string;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  email!: string;

  @Column({ name: "password_hash", type: String, unique: true, nullable: true })
  passwordHash!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Cycle, (cycle) => cycle.user)
  cycles!: Cycle[];

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToOne(() => Configuration, (configuration) => configuration.user)
  configuration!: Configuration;
}

export type user = User;
