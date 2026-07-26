import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User, UserRole } from './users.entity';
import { UsersService } from './users.service';
import { UserExistsPipe } from './pipes/user-exists.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Roles, RolesGuard } from '@/auth/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async find(): Promise<UserResponseDto[]> {
    const users = await this.usersService.find();
    return users.map((user) => this.formattedUserData(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return this.formattedUserData(user);
  }

  @Post()
  @UsePipes(UserExistsPipe)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return this.formattedUserData(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto);
    return this.formattedUserData(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  private formattedUserData(user: User): UserResponseDto {
    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
