import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @ApiProperty({
    description: 'uuid of the account, must be unique',
    type: String,
  })
  uuid: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'startbalance of the account',
    type: Number,
    minimum: 0,
  })
  balance: number;
}
