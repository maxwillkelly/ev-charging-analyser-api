import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cassandra, { mapping } from 'cassandra-driver';
import { Charge } from './charge.model';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { BatteryCharge } from 'src/batteryCharge/batteryCharge.model';
import { addDays, formatISO, parseISO } from 'date-fns';

@Injectable()
export class ChargeService implements OnModuleInit {
  chargeMapper: mapping.ModelMapper<Charge>;
  keyspace: string;

  constructor(
    private readonly cassandraService: CassandraService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.keyspace = this.configService.get<string>('CASSANDRA_KEYSPACE');

    const cql = `
      CREATE TABLE IF NOT EXISTS ${this.keyspace}.charge (
        vehicle_id uuid, 
        started_at_percent_remaining float,
        finished_at_percent_remaining float,
        started_at_time timestamp,
        finished_at_time timestamp,
        PRIMARY KEY (vehicle_id, started_at_time)
      ) WITH CLUSTERING ORDER BY (started_at_time DESC);
    `;

    this.cassandraService.run(cql);

    const mappingOptions: mapping.MappingOptions = {
      models: {
        Charge: {
          keyspace: this.keyspace,
          tables: ['charge'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.chargeMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('Charge');
  }

  async getChargesAsync(vehicleId: string, limit = 10): Promise<Charge[]> {
    return (await this.chargeMapper.find({ vehicleId }, { limit })).toArray();
  }

  async getChargesOnDayAsync(
    vehicleId: string,
    date: string,
  ): Promise<Charge[]> {
    const dayDate = parseISO(date);
    const endDate = addDays(dayDate, 1);

    const q = cassandra.mapping.q;

    const result = (
      await this.chargeMapper.find({
        vehicleId,
        startedAtTime: q.and(q.gte(dayDate), q.lt(endDate)),
      })
    ).toArray();

    return result;
  }

  async recordChargeAsync(
    vehicleId: string,
    percentRemaining: number,
    recordedAt: string,
    lastBatteryCharge: BatteryCharge,
  ) {
    const lastCharge = await this.getChargesAsync(vehicleId, 1).then((lc) =>
      lc ? lc[0] : undefined,
    );

    if (
      lastBatteryCharge?.recordedAt.getTime() ===
      lastCharge?.finishedAtTime.getTime()
    ) {
      return await this.chargeMapper.update({
        vehicleId,
        startedAtPercentRemaining: lastCharge.startedAtPercentRemaining,
        startedAtTime: lastCharge.startedAtTime,
        finishedAtPercentRemaining: percentRemaining,
        finishedAtTime: recordedAt,
      });
    }

    return (
      await this.chargeMapper.insert({
        vehicleId,
        startedAtPercentRemaining: lastBatteryCharge.percentRemaining,
        startedAtTime: lastBatteryCharge.recordedAt,
        finishedAtPercentRemaining: percentRemaining,
        finishedAtTime: recordedAt,
      })
    ).toArray();
  }
}
