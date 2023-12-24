import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'uuid of the user, must be unique',
    type: String,
  })
  uuid: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'startbalance of the user',
    type: Number,
    minimum: 0,
  })
  balance: number;
}
