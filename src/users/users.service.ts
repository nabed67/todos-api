import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const findUser = await this.usersRepository.findOneBy({ id });
    if (!findUser) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }

    return findUser;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: dto.email });
    if (user) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }

    const newUser = this.usersRepository.create(dto);
    return this.usersRepository.save(newUser);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const findUser = await this.findOne(id);
    Object.assign(findUser, dto);
    return this.usersRepository.save(findUser);
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete({ id });
    if (result.affected === 0) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    const findUser = await this.usersRepository.findOneBy({ email });
    if (!findUser) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }

    return findUser;
  }

  async findByEmailPassword(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      throw new BadRequestException(
        'Please check the provided email and password and try again',
      );
    }

    return user;
  }

  async updateHashRefreshToken(userId: string, token: string): Promise<void> {
    const result = await this.usersRepository.update(
      { id: userId },
      { currentHashedRefreshToken: token },
    );

    if (result.affected === 0) {
      throw new BadRequestException(
        'Please check the provided id and try again',
      );
    }
  }
}
