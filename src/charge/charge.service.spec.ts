import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from './charge.service';

describe('ChargeService', () => {
  let service: ChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [ChargeService, CassandraService],
    }).compile();

    service = module.get<ChargeService>(ChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
