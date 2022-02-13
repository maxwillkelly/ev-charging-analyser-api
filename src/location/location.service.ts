import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mapping } from 'cassandra-driver';
import { v4 as uuid } from 'uuid';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { RecordLocation } from './dtos/recordLocation.dto';
import { Location } from './location.model';
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

  async recordLocation(location: RecordLocation): Promise<Location[]> {
    return (
      await this.locationMapper.insert({ id: uuid(), ...location })
    ).toArray();
  }
}
