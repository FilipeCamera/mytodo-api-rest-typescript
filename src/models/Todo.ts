import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";

@Entity({ name: "todos" })
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @Column({ nullable: false })
  text: string;

  @CreateDateColumn({ nullable: false, update: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;
}
