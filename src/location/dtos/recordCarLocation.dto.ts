import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class RecordCarLocation {
  @IsNumberString()
  version: string;

  @IsUUID()
  webhookId: string;

  @IsString()
  eventName: string;

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
