import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @ApiProperty({
    description: "user's username",
    type: String,
  })
  username: string;

  @IsString()
  @ApiProperty({
    description: "user's password",
    type: String,
  })
  password: string;
}
