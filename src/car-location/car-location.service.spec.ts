import { Test, TestingModule } from '@nestjs/testing';
import { CarLocationService } from './car-location.service';

describe('CarLocationService', () => {
  let service: CarLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarLocationService],
    }).compile();

    service = module.get<CarLocationService>(CarLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
