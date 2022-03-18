import {
  IsDateString,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Battery, Charge, Location } from 'smartcar';

export type SmartCarMode = 'test' | 'live';
export type WebhookPath = '/battery' | '/charge' | '/location';

export class WebhookDto {
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
  payload?: SchedulePayload | VerifyPayload;
}

export class SchedulePayload {
  @ValidateNested()
  vehicles: VehicleWebhookResponse[];
}

export class VerifyPayload {
  @IsString()
  challenge: string;
}

export class VerifyWebhookDto {
  @IsString()
  challenge: string;
}

export class VehicleWebhookResponse {
  @IsUUID()
  vehicleId: string;

  @IsUUID()
  requestId: string;

  @ValidateNested()
  data: VehicleWebhookData[];

  @IsDateString()
  timestamp: string;
}

export class VehicleWebhookHeaders {
  @IsDateString()
  'sc-data-age': string;
}

export class VehicleWebhookData {
  @IsIn(['/battery', '/charge', '/location'])
  path: WebhookPath;

  @IsNumber()
  code: number;

  @ValidateNested()
  body: Battery | Charge | Location;

  @ValidateNested()
  headers: VehicleWebhookHeaders;
}
