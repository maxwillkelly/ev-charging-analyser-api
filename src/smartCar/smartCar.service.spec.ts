import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SmartCarService } from './smartCar.service';

describe('SmartCarService', () => {
  let service: SmartCarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SmartCarService, PrismaService],
    }).compile();

    service = module.get<SmartCarService>(SmartCarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
