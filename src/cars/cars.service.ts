import { Injectable } from '@nestjs/common';
import {
  ActionResponse,
  Attributes,
  Battery,
  Charge,
  Location,
} from 'smartcar';
import { BatteryCharge } from '../batteryCharge/batteryCharge.model';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { ChargeService } from '../charge/charge.service';
import { LocationService } from '../location/location.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { CarDto } from './dtos/car.dto';
import { Charge as ChargeModel } from '../charge/charge.model';
@Injectable()
export class CarsService {
  constructor(
    private readonly smartCarService: SmartCarService,
    private readonly locationService: LocationService,
    private readonly batteryChargeService: BatteryChargeService,
    private readonly chargeService: ChargeService,
  ) {}

  async getCarsAsync(userId: string): Promise<CarDto[]> {
    try {
      const vehicles = await this.smartCarService.getVehiclesAsync(userId);

      const cars = Promise.all(
        vehicles.map(async (vehicle) => {
          const batchResponse = await vehicle.batch([
            '/',
            '/battery',
            '/charge',
          ]);

          const attributes = batchResponse.attributes() as Attributes;
          const batteryLevel = batchResponse.battery() as Battery;
          const chargeStatus = batchResponse.charge() as Charge;

          const currentDateTime = new Date().toISOString();

          await this.batteryChargeService.recordBatteryChargeAsync(
            batteryLevel,
            chargeStatus,
            vehicle.id,
            currentDateTime,
          );

          const { make, model, year } = attributes;
          const name = `${year} ${make} ${model}`;

          return { ...attributes, ...batteryLevel, ...chargeStatus, name };
        }),
      );

      return cars;
    } catch (error) {
      return [];
    }
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

  async getChargingHistoryAsync(vehicleId: string): Promise<BatteryCharge[]> {
    return this.batteryChargeService.getBatteryChargesByVehicleAsync(vehicleId);
  }

  async getChargesAsync(
    vehicleId: string,
    date: string,
  ): Promise<ChargeModel[]> {
    return this.chargeService.getChargesOnDayAsync(vehicleId, date);
  }

  async disconnectCarAsync(vehicleId: string, userId: string) {
    return this.smartCarService.disconnectVehicleAsync(vehicleId, userId);
  }
}
