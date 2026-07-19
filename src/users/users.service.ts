import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';

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

  async create(body: CreateUserDto): Promise<User> {
    const createUser = this.usersRepository.create(body);
    return await this.usersRepository.save(createUser);
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    const findUser = await this.findOne(id);
    Object.assign(findUser, body);
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
}
