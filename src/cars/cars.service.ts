import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionResponse, Location, Meta, WebhookSubscription } from 'smartcar';
import { LocationService } from 'src/location/location.service';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarDto } from './dtos/addCar.dto';

@Injectable()
export class CarsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly smartCarService: SmartCarService,
    private readonly locationService: LocationService,
  ) {}

  async getCarsAsync(userId: string): Promise<CarDto[]> {
    const vehicles = await this.smartCarService.getVehiclesAsync(userId);

    const cars = Promise.all(
      vehicles.map(async (v) => {
        const attributes = await v.attributes();
        const batteryLevel = await v.battery();

        const { make, model, year } = attributes;
        const name = `${year} ${make} ${model}`;

        return { ...attributes, ...batteryLevel, name };
      }),
    );

    return cars;
  }

  async getLocationAsync(userId: string, vehicleId: string): Promise<Location> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );

    const location = await vehicle.location();

    await this.locationService.recordCarLocationAsync({
      carId: vehicleId,
      ...location,
    });

    return location;
  }

  private async subscribeAsync(
    userId: string,
    vehicleId: string,
    webhookId: string,
  ): Promise<WebhookSubscription> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );

    return await vehicle.subscribe(webhookId);
  }

  // private async unsubscribeAsync(
  //   userId: string,
  //   vehicleId: string,
  //   webhookId: string,
  // ): Promise<Meta> {
  //   const vehicle = await this.smartCarService.getVehicleAsync(
  //     userId,
  //     vehicleId,
  //   );

  //   return await vehicle.unsubscribe(webhookId);
  // }

  async subscribeLocationAsync(userId: string, vehicleId: string) {
    const webhookId = this.configService.get<string>(
      'SMARTCAR_CAR_LOCATION_WEBHOOK_ID',
    );

    return await this.subscribeAsync(userId, vehicleId, webhookId);
  }

  async lockCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );
    return await vehicle.lock();
  }

  async unlockCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );
    return await vehicle.unlock();
  }
}
