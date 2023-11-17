import { IsInt, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  readonly sender: string;

  @IsString()
  readonly receiver: string;

  @IsInt()
  readonly amount: number;
}
