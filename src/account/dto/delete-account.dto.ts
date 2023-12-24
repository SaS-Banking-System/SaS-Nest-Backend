import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @ApiProperty()
  uuid: string;
}
