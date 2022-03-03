import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Location } from 'smartcar';

export type SmartCarMode = 'test' | 'live';

export class RecordCarLocationWebhook {
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
  @IsIn(['/location'])
  path: string;

  @IsIn([200])
  code: number;

  @ValidateNested()
  body: Location;

  @ValidateNested()
  headers: VehicleWebhookHeaders;
}
