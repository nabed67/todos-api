import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardRequest } from '@/common/interfaces/guard-request.interface';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log(this.reflector);
    const requiredRoles = this.reflector.getAll<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return false;
    }

    const req = context.switchToHttp().getRequest<GuardRequest>();

    return requiredRoles.includes(req.user.role);
  }
}
