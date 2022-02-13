import { IsDateString, IsNumber, IsUUID, ValidateIf } from 'class-validator';

export class RecordLocation {
  @ValidateIf((o) => !o.userId || o.carId)
  @IsUUID()
  carId?: string;

  @ValidateIf((o) => !o.carId || o.userId)
  @IsUUID()
  userId?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsDateString()
  recordedAt: string;
}
