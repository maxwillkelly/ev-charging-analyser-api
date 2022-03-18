import { Injectable } from '@nestjs/common';
import { Battery, Charge, Location } from 'smartcar';
import { BatteryChargeService } from 'src/charge/batteryCharge.service';
import { LocationService } from 'src/location/location.service';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import {
  SchedulePayload,
  VehicleWebhookData,
  VerifyPayload,
  VerifyWebhookDto,
  WebhookDto,
} from './dtos/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly batteryChargeService: BatteryChargeService,
    private readonly locationService: LocationService,
    private readonly smartCarService: SmartCarService,
  ) {}

  async recordWebhookAsync(
    dto: WebhookDto,
  ): Promise<VerifyWebhookDto | boolean> {
    switch (dto.eventName) {
      case 'schedule':
        const schedulePayload = dto.payload as SchedulePayload;
        return await this.scheduleWebhookAsync(schedulePayload);

      case 'verify':
        const verifyPayload = dto.payload as VerifyPayload;
        return this.verifyWebhook(verifyPayload);

      default:
        console.log(JSON.stringify(dto, null, 2));
        return false;
    }
  }

  async scheduleWebhookAsync(payload: SchedulePayload): Promise<boolean> {
    const { vehicles } = payload;

    vehicles.forEach((vehicle) => {
      const { data, vehicleId, timestamp } = vehicle;

      data.forEach(
        async (webhookData) =>
          await this.processVehicleWebhookDataAsync(
            webhookData,
            vehicleId,
            timestamp,
          ),
      );
    });

    return true;
  }

  async processVehicleWebhookDataAsync(
    webhookData: VehicleWebhookData,
    vehicleId: string,
    timestamp: string,
  ): Promise<unknown> {
    const { body, path } = webhookData;

    switch (path) {
      case '/battery':
        const battery = body as Battery;
        return await this.batteryChargeService.recordBatteryLevelAsync(
          battery,
          vehicleId,
          timestamp,
        );

      case '/charge':
        const charge = body as Charge;
        return await this.batteryChargeService.recordChargeStateAsync(
          charge,
          vehicleId,
          timestamp,
        );

      case '/location':
        const location = body as Location;
        return await this.locationService.recordCarLocationAsync(
          location,
          vehicleId,
          timestamp,
        );

      default:
        return false;
    }

    return true;
  }

  verifyWebhook(payload: VerifyPayload): VerifyWebhookDto {
    const challenge = this.smartCarService.hashChallenge(payload.challenge);
    return { challenge };
  }
}
