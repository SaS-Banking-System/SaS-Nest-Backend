import { ApiProperty } from '@nestjs/swagger';
import {
  Max,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @ApiProperty({
    type: String
  })
  uuid: string;

  @IsString()
  @ApiProperty({
    type: String
  })
  name: string;

  @IsInt()
  @ApiProperty({
    type: Number
  })
  code: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @ApiProperty({
    type: Number,
    minimum: 0,
    maximum: 1,

  })
  taxAmount: number;
}
