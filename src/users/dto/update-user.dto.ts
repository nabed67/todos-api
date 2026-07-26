import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters long' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;
}
