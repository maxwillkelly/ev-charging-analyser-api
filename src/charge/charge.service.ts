import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapping } from 'cassandra-driver';
import { Charge } from 'smartcar';
import { CassandraService } from 'src/cassandra/cassandra.service';

@Injectable()
export class ChargeService implements OnModuleInit {
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const keyspace = this.configService.get<string>('CASSANDRA_KEYSPACE');

    const cql = `
      CREATE TABLE IF NOT EXISTS ${keyspace}.charge (
        vehicle_id uuid, 
        recorded_at timestamp,
        started_at_percent_remaining float,
        finished_at_percent_remaining float,
        started_at_time timestamp,
        finished_at_time timestamp,
        PRIMARY KEY (vehicle_id, recorded_at)
      ) WITH CLUSTERING ORDER BY (recorded_at DESC);
    `;

    this.cassandraService.run(cql);

    const mappingOptions: mapping.MappingOptions = {
      models: {
        Charge: {
          keyspace,
          tables: ['charge'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.chargeMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('Charge');
  }

  async getChargesAsync(vehicleId: string): Promise<Charge[]> {
    return (await this.chargeMapper.find({ vehicleId })).toArray();
  }

  async recordChargeAsync(
    vehicleId: string,
    startedAtPercentRemaining: number,
    finishedAtPercentRemaining: number,
    startedAtTime: string,
    finishedAtTime: string,
  ) {
    return (
      await this.chargeMapper.insert({
        vehicleId,
        recordedAt: new Date(),
        startedAtPercentRemaining,
        finishedAtPercentRemaining,
        startedAtTime,
        finishedAtTime,
      })
    ).toArray();
  }

  chargeMapper: mapping.ModelMapper<Charge>;
}
