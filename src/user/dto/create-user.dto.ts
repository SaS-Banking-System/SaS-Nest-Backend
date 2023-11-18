import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "uuid of the user, must be unique",
    type: String

  })
  @IsString()
  uuid: string;

  @ApiProperty({
    description: "startbalance of the user",
    type: Number,
    minimum: 1
  })
  @IsInt()
  balance: number;
}
