import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginResponse } from 'src/auth/dtos/login.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
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
  async addUser(@Body() command: RegisterDto): Promise<LoginResponse> {
    const { firstName, lastName, email, password } = command;
    const hashedPassword = await hash(password, 10);

    const user = await this.prismaService.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    return this.authService.login(user);
  }
}
