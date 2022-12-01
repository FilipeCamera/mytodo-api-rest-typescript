import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from './user';

enum TodoStage {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

@Entity('todos')
export default class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.todos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column({ nullable: false })
  text: string;

  @Column({
    type: 'enum',
    enum: TodoStage,
    default: TodoStage.TODO,
    nullable: false,
  })
  stage: string;

  @CreateDateColumn({ nullable: false, update: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;
}
