import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChallengeDto } from './dtos/challenge.dto';
import { LoginResponse } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const authorized = await compare(password, user.password);

    if (!authorized) return null;

    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { email: user.email, sub: user.id };

    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}
