import { Test, TestingModule } from '@nestjs/testing';
import { BatteryChargeService } from './batteryCharge.service';

describe('BatteryChargeService', () => {
  let service: BatteryChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatteryChargeService],
    }).compile();

    service = module.get<BatteryChargeService>(BatteryChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
