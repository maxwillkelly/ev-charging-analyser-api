import { Test, TestingModule } from '@nestjs/testing';
import { BatteryChargeService } from './batteryCharge.service';
import { CassandraService } from '../cassandra/cassandra.service';
import { ConfigModule } from '@nestjs/config';
import { ChargeService } from '../charge/charge.service';

describe('BatteryChargeService', () => {
  let service: BatteryChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [BatteryChargeService, CassandraService, ChargeService],
    }).compile();

    service = module.get<BatteryChargeService>(BatteryChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
