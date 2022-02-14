import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SmartCar, {
  Access,
  ActionResponse,
  Attributes,
  AuthClient,
  Battery,
  getVehicles,
  Location,
  Vehicle,
  VehicleIds,
} from 'smartcar';

@Injectable()
export class SmartCarService {
  private readonly client: AuthClient = null;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('SMARTCAR_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'SMARTCAR_CLIENT_SECRET',
    );
    const redirectUri = this.configService.get<string>('SMARTCAR_REDIRECT_URI');

    this.client = new SmartCar.AuthClient({
      clientId,
      clientSecret,
      redirectUri,
      testMode: true,
    });
  }

  getAuthUrl(): string {
    const scope = [
      'required:read_battery',
      'required:read_charge',
      'required:control_charge',
      'required:read_location',
      'required:control_security',
      // 'required:read_odometer',
      // 'required:read_tires',
      'required:read_vehicle_info',
      // 'required:read_vin',
    ];
    return this.client.getAuthUrl(scope);
  }

  exchange(code: string): Access {
    return this.client.exchangeCode(code);
  }

  async getVehicles(smartCarAccessToken: string): Promise<Vehicle[]> {
    const vehicleResponse = await SmartCar.getVehicles(smartCarAccessToken);
    const vehicleIds = vehicleResponse.vehicles;
    const vehicles = vehicleIds.map(
      (v) => new SmartCar.Vehicle(v, smartCarAccessToken),
    );

    return vehicles;
  }

  async getVehiclesAttributes(
    vehicles: SmartCar.Vehicle[],
  ): Promise<Attributes[]> {
    const vehiclesAttributes = await Promise.all(
      vehicles.map(async (v) => await v.attributes()),
    );
    return vehiclesAttributes;
  }

  async getVehicle(smartCarAccessToken: string): Promise<Vehicle> {
    const vehicles = await SmartCar.getVehicles(smartCarAccessToken);

    // instantiate first vehicle in vehicle list
    const vehicle = new SmartCar.Vehicle(
      vehicles.vehicles[0],
      smartCarAccessToken,
    );

    return vehicle;
  }

  async getVehicleAttributes(smartCarAccessToken: string): Promise<Attributes> {
    const vehicle = await this.getVehicle(smartCarAccessToken);
    return vehicle.attributes();
  }

  async getBatteryLevels(vehicles: Vehicle[]): Promise<Battery[]> {
    const batteryLevels = await Promise.all(
      vehicles.map(async (v) => await v.battery()),
    );
    return batteryLevels;
  }

  async getLocation(smartCarAccessToken: string): Promise<Location> {
    const vehicle = await this.getVehicle(smartCarAccessToken);
    return await vehicle.location();
  }

  async lockCar(smartCarAccessToken: string): Promise<ActionResponse> {
    const vehicle = await this.getVehicle(smartCarAccessToken);
    return await vehicle.lock();
  }

  async unlockCar(smartCarAccessToken: string): Promise<ActionResponse> {
    const vehicle = await this.getVehicle(smartCarAccessToken);
    return await vehicle.unlock();
  }
}
