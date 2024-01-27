import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MinLength, MaxLength } from 'class-validator';

export class CreateCompanyTransactionDto {
  @ApiProperty({
    description: 'uuid of the sender',
    type: String,
  })
  @IsString()
  readonly sender: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(4)
  readonly code: string;

  @ApiProperty({
    description: 'amount to send',
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  readonly amount: number;
}
