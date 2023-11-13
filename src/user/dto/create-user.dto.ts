import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  uuid: string;

  @IsInt()
  balance: number;
}
