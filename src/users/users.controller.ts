import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { LoginResponse } from 'src/auth/dtos/login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() command: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      command.email,
      command.password,
    );
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() command: RegisterDto): Promise<LoginResponse> {
    return await this.usersService.register(command);
  }
}
