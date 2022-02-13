import { IsUUID } from 'class-validator';

export class CarActionDto {
  @IsUUID()
  smartCarAccessToken: string;
}
