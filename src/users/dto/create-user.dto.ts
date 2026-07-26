import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters long' })
  @IsNotEmpty({ message: 'Name is required!' })
  @IsString()
  name!: string;

  @MaxLength(100, { message: 'Email maximum 100 characters long' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'Email is required!' })
  @IsEmail()
  @IsString()
  email!: string;

  @Length(4, 16, {
    message: 'Password must be between 4 and 16 characters long',
  })
  @IsNotEmpty({ message: 'Password is required!' })
  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;
}
