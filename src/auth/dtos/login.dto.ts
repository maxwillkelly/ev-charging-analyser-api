import { IsEmail, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @ValidateNested()
  user: UserDto;

  @IsUUID()
  token: string;
}
