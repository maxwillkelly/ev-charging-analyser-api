import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapping } from 'cassandra-driver';
import { v4 as uuid } from 'uuid';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { RecordCarLocation } from './dtos/recordCarLocation.dto';
import { Location } from './location.model';
import { RecordUserLocation } from './dtos/recordUserLocation.dto';
@Injectable()
export class LocationService implements OnModuleInit {
  constructor(
    private cassandraService: CassandraService,
    private configService: ConfigService,
  ) {}

  locationMapper: mapping.ModelMapper<Location>;

  onModuleInit() {
    const keyspace = this.configService.get<string>('CASSANDRA_KEYSPACE');

    const cql = `
      CREATE TABLE IF NOT EXISTS ${keyspace}.location (
        id uuid,
        car_id uuid, 
        user_id uuid,
        latitude float,
        longitude float,
        recorded_at timestamp,
        altitude float,
        heading float,
        altitude_accuracy float,
        speed float,
        accuracy float,
        PRIMARY KEY (id)
      );
    `;

    this.cassandraService.run(cql);

    const mappingOptions: mapping.MappingOptions = {
      models: {
        Location: {
          keyspace,
          tables: ['location'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.locationMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('Location');
  }

  async getLocations(): Promise<Location[]> {
    return (await this.locationMapper.findAll()).toArray();
  }

  async getLocationById(id: string): Promise<Location[]> {
    return (await this.locationMapper.find({ id })).toArray();
  }

  async recordCarLocation(location: RecordCarLocation): Promise<Location[]> {
    return (
      await this.locationMapper.insert({ id: uuid(), ...location })
    ).toArray();
  }

  convertUnixTimeToDateString(unixTime: number): string {
    const dateObject = new Date(unixTime * 1000);
    return dateObject.toLocaleString();
  }

  async recordUserLocation(location: RecordUserLocation): Promise<Location[]> {
    const { userId, timestamp, coords } = location;
    const {
      latitude,
      longitude,
      altitude,
      heading,
      altitudeAccuracy,
      speed,
      accuracy,
    } = coords;

    const recordedAt = this.convertUnixTimeToDateString(timestamp);

    const data = {
      id: uuid(),
      userId,
      recordedAt,
      latitude,
      longitude,
      altitude,
      heading,
      altitudeAccuracy,
      speed,
      accuracy,
    };

    return (await this.locationMapper.insert(data)).toArray();
  }
}
