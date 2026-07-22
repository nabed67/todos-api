import { UserRole } from '@/users/users.entity';

export interface AuthResponse {
  message: string;
  success: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: UserRole;
    email: string;
    image?: string;
  };
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}
