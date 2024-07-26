import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Session } from "./Session";
import { Configuration } from "./Configuration";

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

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToOne(() => Configuration, (configuration) => configuration.user)
  configuration!: Configuration;
}

export type user = User;
