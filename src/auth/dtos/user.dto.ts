import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
