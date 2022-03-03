import { IsNumber, IsUUID } from 'class-validator';

export class CarLocation {
  @IsUUID()
  vehicleId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
