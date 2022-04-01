import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, SmartCarUser } from '@prisma/client';
import { isPast } from 'date-fns';
import SmartCar, {
  ActionResponse,
  AuthClient,
  Meta,
  Vehicle,
  WebhookSubscription,
} from 'smartcar';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SmartCarService {
  private readonly client: AuthClient;
  private webhookId: string;
  private managementApiToken: string;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    const clientId = this.configService.get<string>('SMARTCAR_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'SMARTCAR_CLIENT_SECRET',
    );
    const redirectUri = this.configService.get<string>('SMARTCAR_REDIRECT_URI');
    const testMode = this.configService.get<boolean>('SMARTCAR_TEST_MODE');

    this.webhookId = this.configService.get('SMARTCAR_CAR_LOCATION_WEBHOOK_ID');
    this.managementApiToken = this.configService.get(
      'SMARTCAR_MANAGEMENT_API_TOKEN',
    );

    this.client = new SmartCar.AuthClient({
      clientId,
      clientSecret,
      redirectUri,
      testMode,
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

    const smartCarUserId = await SmartCar.getUser(access.accessToken).then(
      (u) => u.id,
    );

    await this.prismaService.smartCarUser.upsert({
      where: { userId },
      create: { id: smartCarUserId, userId, ...access },
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

    if (!smartCarUser || isPast(smartCarUser.refreshExpiration))
      throw new UnauthorizedException();

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

    await this.storeVehiclesAsync(userId, vehicleIds);

    const vehicles = vehicleIds.map(
      (id) => new SmartCar.Vehicle(id, accessToken),
    );

    await this.subscribeVehiclesAsync(vehicles);

    return vehicles;
  }

  async storeVehiclesAsync(
    userId: string,
    vehicleIds: string[],
  ): Promise<Prisma.BatchPayload> {
    const smartCarUserId: string = await this.prismaService.smartCarUser
      .findUnique({
        where: { userId },
        select: {
          id: true,
        },
      })
      .then((u) => u.id);

    const createManyData = vehicleIds.map((id) => {
      return { id, smartCarUserId, userId };
    });

    return await this.prismaService.vehicle.createMany({
      data: createManyData,
      skipDuplicates: true,
    });
  }

  async disconnectVehicleAsync(
    userId: string,
    vehicleId: string,
  ): Promise<ActionResponse> {
    const accessToken = await this.getAccessTokenAsync(userId);
    const vehicle = new SmartCar.Vehicle(vehicleId, accessToken);
    return await vehicle.disconnect();
  }

  async getVehicleAsync(userId: string, vehicleId: string): Promise<Vehicle> {
    const accessToken = await this.getAccessTokenAsync(userId);
    return new SmartCar.Vehicle(vehicleId, accessToken);
  }

  async subscribeVehiclesAsync(
    vehicles: Vehicle[],
  ): Promise<WebhookSubscription[]> {
    const subscriptions = await Promise.all(
      vehicles.map(async (vehicle) => await vehicle.subscribe(this.webhookId)),
    );

    return subscriptions;
  }

  async unsubscribeVehicleAsync(vehicle: Vehicle): Promise<Meta> {
    return await vehicle.unsubscribe(this.managementApiToken, this.webhookId);
  }

  hashChallenge(challenge: string): string {
    return SmartCar.hashChallenge(this.managementApiToken, challenge);
  }
}
