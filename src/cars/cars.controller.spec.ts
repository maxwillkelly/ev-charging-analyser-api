import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CassandraService } from '../cassandra/cassandra.service';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { CarsController } from './cars.controller';
import { ChargeService } from '../charge/charge.service';
import { CarsService } from './cars.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { LocationService } from '../location/location.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CarsController', () => {
  let controller: CarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [CarsController],
      providers: [
        CarsService,
        BatteryChargeService,
        CassandraService,
        ChargeService,
        SmartCarService,
        LocationService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<CarsController>(CarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
