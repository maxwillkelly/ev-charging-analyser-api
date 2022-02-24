import { IsNumber, IsUUID } from 'class-validator';

export class RecordCarLocation {
  @IsUUID()
  carId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
