import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  lastName: string;

  @IsEmail()
  @MaxLength(32)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
