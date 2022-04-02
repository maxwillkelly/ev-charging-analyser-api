import { Test, TestingModule } from '@nestjs/testing';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { WebhookService } from './webhook.service';
import { ConfigModule } from '@nestjs/config';
import { LocationService } from '../location/location.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
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

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
