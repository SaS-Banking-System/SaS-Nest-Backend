import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: "uuid of the sender",
    type: String
  })
  @IsString()
  readonly sender: string;

  @ApiProperty({
    description: "uuid of the receiver",
    type: String
  })
  @IsString()
  readonly receiver: string;

  @ApiProperty({
    description: "amount to send",
    type: Number
  })
  @IsInt()
  readonly amount: number;
}
