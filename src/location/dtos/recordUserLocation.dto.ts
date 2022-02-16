import { IsNumber, IsUUID, ValidateNested } from 'class-validator';

export class UserCoordinates {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  altitude: number;

  @IsNumber()
  heading: number;

  @IsNumber()
  altitudeAccuracy: number;

  @IsNumber()
  speed: number;

  @IsNumber()
  accuracy: number;
}

export class RecordUserLocation {
  @IsUUID()
  userId: string;

  @IsNumber()
  timestamp: number;

  @ValidateNested()
  coords: UserCoordinates;
}
