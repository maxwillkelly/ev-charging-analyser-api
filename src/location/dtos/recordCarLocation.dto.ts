import { IsNumber, IsUUID } from 'class-validator';

export class RecordCarLocation {
  @IsUUID()
  id: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
