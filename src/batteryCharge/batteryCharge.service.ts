import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapping } from 'cassandra-driver';
import { Battery, Charge } from 'smartcar';
import { CassandraService } from '../cassandra/cassandra.service';
import { ChargeService } from '../charge/charge.service';
import { BatteryCharge } from './batteryCharge.model';

@Injectable()
export class BatteryChargeService implements OnModuleInit {
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly configService: ConfigService,
    private readonly chargeService: ChargeService,
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
    limit = 10,
  ): Promise<BatteryCharge[]> {
    return (
      await this.batteryChargeMapper.find({ vehicleId }, { limit })
    ).toArray();
  }

  async recordBatteryChargeAsync(
    batteryLevel: Battery,
    chargeStatus: Charge,
    vehicleId: string,
    recordedAt: string,
  ) {
    await this.recordBatteryLevelAsync(batteryLevel, vehicleId, recordedAt);
    await this.recordChargeStatusAsync(chargeStatus, vehicleId, recordedAt);
  }

  async recordBatteryLevelAsync(
    batteryLevel: Battery,
    vehicleId: string,
    recordedAt: string,
  ): Promise<BatteryCharge[]> {
    const { range, percentRemaining } = batteryLevel;

    const lastBatteryCharge = await this.getBatteryChargesByVehicleAsync(
      vehicleId,
      1,
    ).then((lbc) => (lbc ? lbc[0] : undefined));

    if (percentRemaining > lastBatteryCharge?.percentRemaining) {
      await this.chargeService.recordChargeAsync(
        vehicleId,
        percentRemaining,
        recordedAt,
        lastBatteryCharge,
      );
    }

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
