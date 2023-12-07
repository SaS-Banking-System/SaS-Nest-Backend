import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns a JWT for authorization for other endpoints',
  })
  @ApiUnauthorizedResponse({
    description:
      'User cannot be authenticated with the supplied username and password',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }
}
