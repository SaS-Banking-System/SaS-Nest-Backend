import { IsString } from 'class-validator';

export class DeleteAdminDto {
  @IsString()
  username: string;
}
