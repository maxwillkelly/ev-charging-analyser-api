import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, SmartCarUser } from '@prisma/client';
import { isPast } from 'date-fns';
import SmartCar, { AuthClient, Vehicle, WebhookSubscription } from 'smartcar';
import { PrismaService } from 'src/prisma/prisma.service';
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

    const smartCarUserId = await SmartCar.getUser(access.accessToken).then(
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

    if (!smartCarUser) return;

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

    if (!accessToken) return [];

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

  async getVehicleAsync(userId: string, vehicleId: string): Promise<Vehicle> {
    const accessToken = await this.getAccessTokenAsync(userId);
    return new SmartCar.Vehicle(vehicleId, accessToken);
  }

  async subscribeVehiclesAsync(
    vehicles: Vehicle[],
  ): Promise<WebhookSubscription[]> {
    const webhookId = this.configService.get<string>(
      'SMARTCAR_CAR_LOCATION_WEBHOOK_ID',
    );

    const subscriptions = await Promise.all(
      vehicles.map(async (vehicle) => await vehicle.subscribe(webhookId)),
    );

    return subscriptions;
  }

  hashChallenge(challenge: string): string {
    const amt = this.configService.get<string>('SMARTCAR_MANAGEMENT_API_TOKEN');
    return SmartCar.hashChallenge(amt, challenge);
  }

  // verifyPayload(challenge: string, body: RecordCarLocation): string {
  //   const amt = this.configService.get<string>('SMARTCAR_MANAGEMENT_API_TOKEN');
  //   return SmartCar.verifyPayload(amt, )
  // }
}
