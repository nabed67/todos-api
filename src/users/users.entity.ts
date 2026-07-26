import { BeforeInsert, Column, Entity } from 'typeorm';
import bcrypt from 'bcryptjs';
import { BaseEntity } from '@/database/base.entity';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  @Column({ default: 0 })
  tokenVersion!: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
