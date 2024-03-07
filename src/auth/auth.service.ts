import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare as bcrypt_compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async signIn(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        username: username,
      },
    });

    if (!admin) throw new UnauthorizedException();

    const passwordResult = await bcrypt_compare(password, admin.password);

    if (admin.username === username && passwordResult) {
      const payload = { sub: admin.id, username: username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    throw new UnauthorizedException();
  }
}
