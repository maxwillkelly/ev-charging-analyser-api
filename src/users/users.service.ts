import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from '../auth/auth.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(command: RegisterDto) {
    const { firstName, lastName, email, password } = command;
    const hashedPassword = await hash(password, 10);

    try {
      const user = await this.prismaService.user.create({
        data: { firstName, lastName, email, password: hashedPassword },
      });

      return this.authService.login(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'An account is already registered using this email',
          );
        }
      }
    }
  }
}
