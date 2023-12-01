import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async signIn(username: string, password: string) {
    const admin = await this.prisma.admin
      .findUnique({
        where: {
          username: username,
        },
      })

    if (!admin) throw new UnauthorizedException();

    if (admin.username === username && admin.password === password) {
      const payload = { sub: admin.id, username: username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    throw new UnauthorizedException();
  }
}
