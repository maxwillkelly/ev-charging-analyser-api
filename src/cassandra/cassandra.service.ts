import { Injectable } from '@nestjs/common';
import { auth, Client, mapping } from 'cassandra-driver';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CassandraService {
  client: Client;
  mapper: mapping.Mapper;

  public constructor(private configService: ConfigService) {}

  private createClient() {
    const contactPoint = this.configService.get<string>(
      'CASSANDRA_CONTACT_POINT',
    );
    const localDataCenter = this.configService.get<string>(
      'CASSANDRA_LOCAL_DATA_CENTER',
    );
    const username = this.configService.get<string>('CASSANDRA_USER');
    const password = this.configService.get<string>('CASSANDRA_PASSWORD');

    const authProvider = new auth.PlainTextAuthProvider(username, password);

    this.client = new Client({
      contactPoints: [contactPoint],
      localDataCenter,
      authProvider,
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
    if (this.client == undefined) {
      this.createClient();
      this.createKeyspace();
    }
    return new mapping.Mapper(this.client, mappingOptions);
  }

  run(cql: string) {
    if (this.client == undefined) {
      this.createClient();
      this.createKeyspace();
    }

    this.client.connect(() => this.client.execute(cql));
  }
}
