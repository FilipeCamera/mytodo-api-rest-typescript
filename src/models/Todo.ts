import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.todos, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @Column({ nullable: false })
  text: string;

  @CreateDateColumn({ nullable: false, update: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;
}
