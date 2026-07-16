import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required!' })
  @Length(2, 100, {
    message: 'Title must be between 2 and 100 characters long',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title!: string;

  @IsOptional()
  @Length(0, 500, {
    message: 'Description must be at most 500 characters long',
  })
  @IsString({ message: 'Description must be a string' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;
}

export class UpdateTodoDto {
  @IsOptional()
  @Length(2, 100, {
    message: 'Title must be between 2 and 100 characters long',
  })
  @IsString({ message: 'Title must be a string' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title!: string;

  @IsOptional()
  @Length(0, 500, {
    message: 'Description must be at most 500 characters long',
  })
  @IsString({ message: 'Description must be a string' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed!: boolean;
}
