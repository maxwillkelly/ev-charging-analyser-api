import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CassandraService } from '../cassandra/cassandra.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [AuthModule],
  controllers: [LocationController],
  providers: [CassandraService, LocationService],
  exports: [LocationService],
})
export class LocationModule {}
