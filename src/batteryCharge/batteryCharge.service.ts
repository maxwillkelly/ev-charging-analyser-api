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
        PRIMARY KEY (vehicle_id, recorded_at)
      ) WITH CLUSTERING ORDER BY (recorded_at DESC);
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

  // async getBatteryChargesAsync(): Promise<BatteryCharge[]> {
  //   return (await this.batteryChargeMapper.findAll({ limit: 10 })).toArray();
  // }

  async getBatteryChargesByVehicleAsync(
    vehicleId: string,
  ): Promise<BatteryCharge[]> {
    return (
      await this.batteryChargeMapper.find({ vehicleId }, { limit: 10 })
    ).toArray();
  }

  async recordBatteryChargeAsync(
    batteryLevel: Battery,
    chargeStatus: Charge,
    vehicleId: string,
    recordedAt: string,
  ) {
    const { isPluggedIn, state } = chargeStatus;
    const { range, percentRemaining } = batteryLevel;

    return (
      await this.batteryChargeMapper.insert({
        isPluggedIn,
        state,
        range,
        percentRemaining,
        vehicleId,
        recordedAt,
      })
    ).toArray();
  }

  async recordBatteryLevelAsync(
    batteryLevel: Battery,
    vehicleId: string,
    recordedAt: string,
  ): Promise<BatteryCharge[]> {
    const { range, percentRemaining } = batteryLevel;

    return (
      await this.batteryChargeMapper.insert({
        range,
        percentRemaining,
        vehicleId,
        recordedAt,
      })
    ).toArray();
  }

  async recordChargeStatusAsync(
    chargeStatus: Charge,
    vehicleId: string,
    recordedAt: string,
  ): Promise<BatteryCharge[]> {
    const { isPluggedIn, state } = chargeStatus;

    return (
      await this.batteryChargeMapper.insert({
        isPluggedIn,
        state,
        vehicleId,
        recordedAt,
      })
    ).toArray();
  }
}
