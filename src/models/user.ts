import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import Role from './role';
import Todo from './todo';

import bcrypt from 'bcrypt';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  role: Role;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false, update: true })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
