import { ConflictException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/users.entity';
import { CreateUserDto } from '@/users/users.dto';

export class UserExistsPipe implements PipeTransform {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async transform(value: CreateUserDto) {
    const { email } = value;

    if (!email) return value;

    const emailExists = await this.usersRepository.findOneBy({ email });
    if (emailExists) {
      throw new ConflictException(`Email "${email}" is already registered`);
    }

    return value;
  }
}
