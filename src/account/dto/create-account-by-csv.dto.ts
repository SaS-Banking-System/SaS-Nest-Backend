import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountByCSVDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
