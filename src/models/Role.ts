import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.role, { lazy: false })
  users: User[];

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;
}
