import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
