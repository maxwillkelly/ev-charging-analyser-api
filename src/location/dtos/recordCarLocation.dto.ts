import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export type SmartCarMode = 'test' | 'live';
export class RecordCarLocation {
  @IsNumberString()
  version: string;

  @IsUUID()
  webhookId: string;

  @IsString()
  eventName: string;

  @IsOptional()
  @IsIn(['test', 'live'])
  mode?: SmartCarMode;

  @ValidateNested()
  payload?: CarLocation | ChallengePayload;
}

export class CarLocation {
  @IsUUID()
  vehicleId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class ChallengePayload {
  @IsString()
  challenge: string;
}
