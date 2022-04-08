import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CassandraService } from './cassandra/cassandra.service';
import { BatteryChargeService } from './batteryCharge/batteryCharge.service';
import { ChargeService } from './charge/charge.service';
import { CarsModule } from './cars/cars.module';
import { LocationModule } from './location/location.module';
import { WebhookModule } from './webhook/webhook.module';
import { SmartCarModule } from './smartCar/smartCar.module';

const validationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  API_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .required(),
  JWT_KEY: Joi.string().required(),
  SMARTCAR_CLIENT_ID: Joi.string().uuid().required(),
  SMARTCAR_CLIENT_SECRET: Joi.string().uuid().required(),
  SMARTCAR_MANAGEMENT_API_TOKEN: Joi.string().uuid().required(),
  SMARTCAR_REDIRECT_URI: Joi.string().uri().required(),
  SMARTCAR_CAR_LOCATION_WEBHOOK_ID: Joi.string().uuid().required(),
  SMARTCAR_TEST_MODE: Joi.boolean().required(),
  CASSANDRA_CONTACT_POINT: Joi.string().required(),
  CASSANDRA_LOCAL_DATA_CENTER: Joi.string().required(),
  CASSANDRA_PORT: Joi.number().required(),
  CASSANDRA_KEYSPACE: Joi.string().required(),
  CASSANDRA_USER: Joi.string().required(),
  CASSANDRA_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PRISMA_URL: Joi.string().required(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    AuthModule,
    CarsModule,
    LocationModule,
    SmartCarModule,
    UsersModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    CassandraService,
    BatteryChargeService,
    ChargeService,
  ],
})
export class AppModule {}
