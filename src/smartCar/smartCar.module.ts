import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmartCarService } from '../smartCar/smartCar.service';
import { SmartCarController } from './smartCar.controller';

@Module({
  controllers: [SmartCarController],
  providers: [PrismaService, SmartCarService],
  exports: [SmartCarService],
})
export class SmartCarModule {}
