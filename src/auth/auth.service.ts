import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signIn(username: string, password: string) {
    if (username === 'user' && password === 'test') {
      return;
    }

    throw new UnauthorizedException();
  }
}
