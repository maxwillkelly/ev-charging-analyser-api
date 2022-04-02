import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CassandraService } from '../cassandra/cassandra.service';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { LocationService } from '../location/location.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { ChargeService } from '../charge/charge.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WebhookController', () => {
  let controller: WebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [WebhookController],
      providers: [
        WebhookService,
        BatteryChargeService,
        CassandraService,
        ChargeService,
        LocationService,
        SmartCarService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
