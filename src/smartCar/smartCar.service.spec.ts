import { Test, TestingModule } from '@nestjs/testing';
import { SmartCarService } from './smartCar.service';

describe('SmartCarService', () => {
  let service: SmartCarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartCarService],
    }).compile();

    service = module.get<SmartCarService>(SmartCarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
