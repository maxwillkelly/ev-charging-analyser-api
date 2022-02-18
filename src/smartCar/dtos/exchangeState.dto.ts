import { IsUUID } from 'class-validator';

export class ExchangeStateDto {
  @IsUUID()
  userId: string;
}
