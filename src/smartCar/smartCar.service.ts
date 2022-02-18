import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmartCarUser } from '@prisma/client';
import { isPast } from 'date-fns';
import SmartCar, {
  Access,
  ActionResponse,
  Attributes,
  AuthClient,
  Battery,
  Location,
  Vehicle,
} from 'smartcar';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmartCarAPIUserDto } from './dtos/user.dto';

@Injectable()
export class SmartCarService {
  private readonly client: AuthClient = null;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
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

  getAuthUrl(userId: string): string {
    const scope = [
      'required:read_battery',
      'required:read_charge',
      // 'required:control_charge',
      'required:read_location',
      'required:control_security',
      // 'required:read_odometer',
      // 'required:read_tires',
      'required:read_vehicle_info',
      // 'required:read_vin',
    ];
    const options = { state: JSON.stringify({ userId }) };
    return this.client.getAuthUrl(scope, options);
  }

  async exchangeAsync(code: string, userId: string): Promise<boolean> {
    const smartCarAccess = await this.client.exchangeCode(code);

    const smartCarUserId = await this.getUser(smartCarAccess.accessToken).then(
      (u) => u.id,
    );

    await this.prismaService.smartCarUser.upsert({
      where: {
        id_userId: { id: smartCarUserId, userId },
      },
      create: {
        ...smartCarAccess,
        id: smartCarUserId,
        userId,
      },
      update: { ...smartCarAccess },
    });

    return true;
  }

  async getAccessTokenAsync(userId: string): Promise<string> {
    let smartCarUser: SmartCarUser = await this.prismaService.user
      .findUnique({
        where: { id: userId },
        select: {
          smartCarUser: true,
        },
      })
      .then((u) => u.smartCarUser);

    if (isPast(smartCarUser.expiration)) {
      const data = await this.client.exchangeRefreshToken(
        smartCarUser.refreshToken,
      );

      smartCarUser = await this.prismaService.smartCarUser.update({
        where: { userId },
        data,
      });
    }

    return smartCarUser.accessToken;
  }

  async getVehicles(userId: string): Promise<Vehicle[]> {
    const accessToken = await this.getAccessTokenAsync(userId);
    const vehicleResponse = await SmartCar.getVehicles(accessToken);
    const vehicleIds = vehicleResponse.vehicles;
    const vehicles = vehicleIds.map(
      (v) => new SmartCar.Vehicle(v, accessToken),
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

  async getUser(smartCarAccessToken: string): Promise<SmartCarAPIUserDto> {
    const user = await SmartCar.getUser(smartCarAccessToken);
    return user;
  }
}
