import { IsUUID } from 'class-validator';

export class CarActionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  vehicleId: string;
}
