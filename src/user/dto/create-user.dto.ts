import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'uuid of the user, must be unique',
    type: String,
  })
  uuid: string;

  @IsInt()
  @ApiProperty({
    description: 'startbalance of the user',
    type: Number,
    minimum: 1,
  })
  balance: number;
}
