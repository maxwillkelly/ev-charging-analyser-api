import { Injectable } from '@nestjs/common';
import { ActionResponse, Location } from 'smartcar';
import { LocationService } from 'src/location/location.service';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarDto } from './dtos/addCar.dto';

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
