import { Injectable } from '@nestjs/common';
import { ActionResponse, Location } from 'smartcar';
import { LocationService } from 'src/location/location.service';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarDto } from './dtos/car.dto';
@Injectable()
export class CarsService {
  constructor(
    private readonly smartCarService: SmartCarService,
    private readonly locationService: LocationService,
  ) {}

  async getCarsAsync(userId: string): Promise<CarDto[]> {
    const vehicles = await this.smartCarService.getVehiclesAsync(userId);

    const cars = Promise.all(
      vehicles.map(async (v) => {
        const batchResponse = await v.batch(['/', '/battery', '/charge']);

        const attributes = batchResponse.attributes();
        const batteryLevel = batchResponse.battery();
        const chargeStatus = batchResponse.charge();

        const { make, model, year } = attributes;
        const name = `${year} ${make} ${model}`;

        return { ...attributes, ...batteryLevel, ...chargeStatus, name };
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
    const timestamp = new Date().toISOString();

    await this.locationService.recordCarLocationAsync(
      location,
      vehicleId,
      timestamp,
    );

    return location;
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

  async startChargingCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );
    return await vehicle.startCharge();
  }

  async stopChargingCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.smartCarService.getVehicleAsync(
      userId,
      vehicleId,
    );
    return await vehicle.stopCharge();
  }
}
