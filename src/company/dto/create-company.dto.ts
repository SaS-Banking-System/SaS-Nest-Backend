import { ApiProperty } from '@nestjs/swagger';
import {
  Max,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  uuid: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(4)
  @ApiProperty({
    type: Number,
  })
  code: string;

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
