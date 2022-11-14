import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user';

@Entity('refresh_token')
export default class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column({ name: 'expires_in', nullable: false })
  expiresIn: number;

  @CreateDateColumn({ name: 'created_at', nullable: false, update: false })
  createdAt: Date;
}
