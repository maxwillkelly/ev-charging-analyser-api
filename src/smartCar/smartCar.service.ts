import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmartCarUser } from '@prisma/client';
import { isPast } from 'date-fns';
import SmartCar, {
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
    const access = await this.client.exchangeCode(code);

    const smartCarUserId = await this.getUserAsync(access.accessToken).then(
      (u) => u.id,
    );

    await this.prismaService.smartCarUser.upsert({
      where: {
        id_userId: { id: smartCarUserId, userId },
      },
      create: {
        ...access,
        id: smartCarUserId,
        userId,
      },
      update: { ...access },
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

  async getVehiclesAsync(userId: string): Promise<Vehicle[]> {
    const accessToken = await this.getAccessTokenAsync(userId);
    const vehicleResponse = await SmartCar.getVehicles(accessToken);
    const vehicleIds = vehicleResponse.vehicles;
    const vehicles = vehicleIds.map(
      (v) => new SmartCar.Vehicle(v, accessToken),
    );

    return vehicles;
  }

  async getVehiclesAttributesAsync(
    vehicles: SmartCar.Vehicle[],
  ): Promise<Attributes[]> {
    const vehiclesAttributes = await Promise.all(
      vehicles.map(async (v) => await v.attributes()),
    );
    return vehiclesAttributes;
  }

  async getVehicleAsync(userId: string, vehicleId: string): Promise<Vehicle> {
    const accessToken = await this.getAccessTokenAsync(userId);
    return new SmartCar.Vehicle(vehicleId, accessToken);
  }

  async getVehicleAttributesAsync(
    userId: string,
    vehicleId: string,
  ): Promise<Attributes> {
    const vehicle = await this.getVehicleAsync(userId, vehicleId);
    return vehicle.attributes();
  }

  async getBatteryLevelsAsync(vehicles: Vehicle[]): Promise<Battery[]> {
    const batteryLevels = await Promise.all(
      vehicles.map(async (v) => await v.battery()),
    );
    return batteryLevels;
  }

  async getLocationAsync(userId: string, vehicleId: string): Promise<Location> {
    const vehicle = await this.getVehicleAsync(userId, vehicleId);
    return await vehicle.location();
  }

  async lockCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.getVehicleAsync(userId, vehicleId);
    return await vehicle.lock();
  }

  async unlockCarAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const vehicle = await this.getVehicleAsync(userId, vehicleId);
    return await vehicle.unlock();
  }

  async getUserAsync(smartCarAccessToken: string): Promise<SmartCarAPIUserDto> {
    const user = await SmartCar.getUser(smartCarAccessToken);
    return user;
  }
}
