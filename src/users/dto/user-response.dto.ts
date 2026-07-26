import { UserRole } from '@/users/users.entity';

export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  image?: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
