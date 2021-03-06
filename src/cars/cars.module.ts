import { Module } from '@nestjs/common';
import { LocationModule } from '../location/location.module';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { PrismaService } from '../prisma/prisma.service';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { SmartCarModule } from 'src/smartCar/smartCar.module';

@Module({
  imports: [LocationModule, SmartCarModule],
  controllers: [CarsController],
  providers: [
    PrismaService,
    CassandraService,
    CarsService,
    BatteryChargeService,
    ChargeService,
  ],
  exports: [CarsService],
})
export class CarsModule {}
