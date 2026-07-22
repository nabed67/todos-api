import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@/users/users.entity';

export interface ReqUser {
  sub: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['user'] as ReqUser;
  },
);
