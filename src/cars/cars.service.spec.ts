import { Test, TestingModule } from '@nestjs/testing';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { CarsService } from './cars.service';
import { ConfigModule } from '@nestjs/config';
import { SmartCarService } from '../smartCar/smartCar.service';
import { LocationService } from '../location/location.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CarsService,
        BatteryChargeService,
        CassandraService,
        ChargeService,
        LocationService,
        SmartCarService,
        PrismaService,
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
