import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { SmartCarService } from './smartCar/smartCar.service';
import { SmartCarController } from './smartCar/smartCar.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { CarsController } from './cars/cars.controller';
import { CassandraService } from './cassandra/cassandra.service';
import { LocationController } from './location/location.controller';
import { LocationService } from './location/location.service';
import { CarsService } from './cars/cars.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { BatteryChargeService } from './batteryCharge/batteryCharge.service';
import { ChargeService } from './charge/charge.service';

const validationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  API_ENV: Joi.string().valid('local', 'development', 'production').required(),
  JWT_KEY: Joi.string().required(),
  SMARTCAR_CLIENT_ID: Joi.string().uuid().required(),
  SMARTCAR_CLIENT_SECRET: Joi.string().uuid().required(),
  SMARTCAR_MANAGEMENT_API_TOKEN: Joi.string().uuid().required(),
  SMARTCAR_REDIRECT_URI: Joi.string().uri().required(),
  SMARTCAR_CAR_LOCATION_WEBHOOK_ID: Joi.string().uuid().required(),
  SMARTCAR_TEST_MODE: Joi.boolean().required(),
  CASSANDRA_CONTACT_POINT: Joi.string().required(),
  CASSANDRA_LOCAL_DATA_CENTER: Joi.string().required(),
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
    UsersModule,
  ],
  controllers: [
    AppController,
    SmartCarController,
    UsersController,
    CarsController,
    LocationController,
    WebhookController,
  ],
  providers: [
    AuthService,
    SmartCarService,
    PrismaService,
    CassandraService,
    LocationService,
    CarsService,
    UsersService,
    WebhookService,
    BatteryChargeService,
    ChargeService,
  ],
})
export class AppModule {}
