import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class RecordCarLocation {
  @IsUUID()
  carId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsDateString()
  recordedAt: string;
}
