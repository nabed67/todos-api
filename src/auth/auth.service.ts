import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { User } from '@/users/users.entity';
import { UsersService } from '@/users/users.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import {
  AuthResponse,
  LoginResponse,
  TokenPayload,
  TokensResponse,
} from './auth.interface';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: LoginDto): Promise<LoginResponse> {
    const { email, password } = body;

    const user = await this.validateUser(email, password);
    const tokens = this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        image: user.image,
      },
    };
  }

  async register(body: RegisterDto): Promise<AuthResponse> {
    await this.usersService.create(body);
    return { message: 'User registered successfully' };
  }

  // logout() {}

  async refresh(oldToken: string): Promise<TokensResponse> {
    const secret = this.configService.get<string>(JWT_REFRESH_TOKEN)!;

    const payload = this.jwtService.verify<TokenPayload>(oldToken, { secret });

    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const isValidToken = await bcrypt.compare(
      user.currentHashedRefreshToken,
      oldToken,
    );

    if (!isValidToken) {
      throw new ForbiddenException('Token is invalid and try again');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      throw new BadRequestException(
        'Please check the provided email and password and try again',
      );
    }

    return user;
  }

  private generateTokens(user: User): TokensResponse {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_ACCESS_TOKEN),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_REFRESH_TOKEN),
      expiresIn: '7days',
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateHashRefreshToken(userId, hashedToken);
  }
}
