import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @MaxLength(100, { message: 'Email maximum 100 characters long' })
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
}
