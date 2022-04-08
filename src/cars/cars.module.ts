import { Module } from '@nestjs/common';
import { LocationModule } from 'src/location/location.module';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { PrismaService } from '../prisma/prisma.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [LocationModule],
  controllers: [CarsController],
  providers: [
    PrismaService,
    CassandraService,
    CarsService,
    BatteryChargeService,
    ChargeService,
    SmartCarService,
  ],
  exports: [CarsService],
})
export class CarsModule {}
