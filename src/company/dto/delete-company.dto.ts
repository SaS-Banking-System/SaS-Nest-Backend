import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteCompanyDto {
  @IsString()
  @ApiProperty({
    type: String
  })
  uuid: string;
}
