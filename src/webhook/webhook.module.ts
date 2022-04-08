import { Module } from '@nestjs/common';
import { LocationModule } from '../location/location.module';
import { BatteryChargeService } from '../batteryCharge/batteryCharge.service';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { SmartCarModule } from 'src/smartCar/smartCar.module';

@Module({
  imports: [LocationModule, SmartCarModule],
  controllers: [WebhookController],
  providers: [
    PrismaService,
    CassandraService,
    WebhookService,
    BatteryChargeService,
    ChargeService,
  ],
})
export class WebhookModule {}
