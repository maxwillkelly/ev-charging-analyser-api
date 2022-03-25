import { Injectable, OnModuleInit } from '@nestjs/common';
import { ArrayOrObject, auth, Client, mapping, types } from 'cassandra-driver';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';

const CERTIFICATE_PATH = './certificates/sf-class2-root.crt';
const CASSANDRA_LOCAL_PORT = 9042;
const CASSANDRA_HOSTED_PORT = 9142;
@Injectable()
export class CassandraService implements OnModuleInit {
  client: Client;

  public constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = this.createClient();
    this.createKeyspace();
  }

  private generateSslOptions(): Record<string, unknown> {
    const apiEnvironment = this.configService.get<string>('API_ENV');
    const host = this.configService.get<string>('CASSANDRA_CONTACT_POINT');

    switch (apiEnvironment) {
      case 'local':
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
    const apiEnvironment = this.configService.get<string>('API_ENV');
    const contactPoint = this.configService.get<string>(
      'CASSANDRA_CONTACT_POINT',
    );
    const localDataCenter = this.configService.get<string>(
      'CASSANDRA_LOCAL_DATA_CENTER',
    );
    const username = this.configService.get<string>('CASSANDRA_USER');
    const password = this.configService.get<string>('CASSANDRA_PASSWORD');

    const authProvider = new auth.PlainTextAuthProvider(username, password);
    const sslOptions = this.generateSslOptions();

    const protocolOptions = {
      port:
        apiEnvironment === 'local'
          ? CASSANDRA_LOCAL_PORT
          : CASSANDRA_HOSTED_PORT,
    };

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
