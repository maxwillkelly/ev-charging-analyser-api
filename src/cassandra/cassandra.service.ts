import { Injectable, OnModuleInit } from '@nestjs/common';
import { auth, Client, mapping, types } from 'cassandra-driver';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';

const CERTIFICATE_PATH = './certificates/sf-class2-root.crt';
@Injectable()
export class CassandraService implements OnModuleInit {
  private client: Client;
  private apiEnvironment: string;

  public constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.apiEnvironment = this.configService.get('API_ENV');
    this.client = this.createClient();
    this.createKeyspace();
  }

  private generateSslOptions(): Record<string, unknown> {
    const host = this.configService.get<string>('CASSANDRA_CONTACT_POINT');

    switch (this.apiEnvironment) {
      case 'development':
        return null;

      default:
        const certificate = fs.readFileSync(CERTIFICATE_PATH, 'utf-8');

        return {
          ca: [certificate],
          host,
          rejectUnauthorized: true,
        };
    }
  }

  private createClient() {
    const contactPoint = this.configService.get<string>(
      'CASSANDRA_CONTACT_POINT',
    );
    const localDataCenter = this.configService.get<string>(
      'CASSANDRA_LOCAL_DATA_CENTER',
    );
    const port = this.configService.get<number>('CASSANDRA_PORT');
    const username = this.configService.get<string>('CASSANDRA_USER');
    const password = this.configService.get<string>('CASSANDRA_PASSWORD');

    const authProvider = new auth.PlainTextAuthProvider(username, password);
    const sslOptions = this.generateSslOptions();

    const protocolOptions = { port };

    return new Client({
      contactPoints: [contactPoint],
      localDataCenter,
      authProvider,
      sslOptions,
      protocolOptions,
      queryOptions: { consistency: types.consistencies.localQuorum },
    });
  }

  private createKeyspace() {
    const keyspace = this.configService.get<string>('CASSANDRA_KEYSPACE');

    const cql = `
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
        WITH REPLICATION = { 
          'class' : 'SimpleStrategy', 
          'replication_factor' : 1 
        }`;

    this.run(cql);
  }

  createMapper(mappingOptions: mapping.MappingOptions) {
    return new mapping.Mapper(this.client, mappingOptions);
  }

  run(cql: string) {
    this.client.connect(() => this.client.execute(cql));
  }
}
