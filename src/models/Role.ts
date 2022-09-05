import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;
}
