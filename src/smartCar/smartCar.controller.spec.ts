import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SmartCarController } from './smartCar.controller';
import { SmartCarService } from './smartCar.service';

describe('SmartcarController', () => {
  let controller: SmartCarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [SmartCarController],
      providers: [SmartCarService, PrismaService],
    }).compile();

    controller = module.get<SmartCarController>(SmartCarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
