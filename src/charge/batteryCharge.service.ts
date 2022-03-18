import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapping } from 'cassandra-driver';
import { Battery, Charge } from 'smartcar';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { BatteryCharge } from './batteryCharge.model';

@Injectable()
export class BatteryChargeService implements OnModuleInit {
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly configService: ConfigService,
  ) {}

  batteryChargeMapper: mapping.ModelMapper<BatteryCharge>;

  onModuleInit() {
    const keyspace = this.configService.get<string>('CASSANDRA_KEYSPACE');

    const cql = `
      CREATE TABLE IF NOT EXISTS ${keyspace}.battery_charge (
        vehicle_id uuid, 
        recorded_at timestamp,
        range float,
        percent_remaining float,
        is_plugged_in boolean,
        PRIMARY KEY ((vehicle_id, recorded_at))
      );
    `;

    this.cassandraService.run(cql);

    const mappingOptions: mapping.MappingOptions = {
      models: {
        BatteryCharge: {
          keyspace,
          tables: ['battery_charge'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.batteryChargeMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('BatteryCharge');
  }

  async getBatteryChargesAsync(): Promise<BatteryCharge[]> {
    return (await this.batteryChargeMapper.findAll()).toArray();
  }

  async recordBatteryLevelAsync(
    batteryLevel: Battery,
    vehicleId: string,
    timestamp: string,
  ): Promise<BatteryCharge[]> {
    return (
      await this.batteryChargeMapper.insert({
        ...batteryLevel,
        vehicleId,
        timestamp,
      })
    ).toArray();
  }

  async recordChargeStateAsync(
    chargeState: Charge,
    vehicleId: string,
    timestamp: string,
  ): Promise<BatteryCharge[]> {
    return (
      await this.batteryChargeMapper.insert({
        ...chargeState,
        vehicleId,
        timestamp,
      })
    ).toArray();
  }
}
