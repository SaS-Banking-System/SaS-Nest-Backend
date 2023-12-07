import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteAdminDto {
  @IsString()
  @ApiProperty()
  username: string;
}
