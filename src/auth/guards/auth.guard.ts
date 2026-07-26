import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { TokenPayload } from '@/auth/auth.interface';
import { JWT_ACCESS_TOKEN } from '@/auth/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized Access!');
    }

    try {
      const payload = await this.verifyJwtToken(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Unauthorized Access!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyJwtToken(token: string) {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>(JWT_ACCESS_TOKEN),
    });
  }
}
