import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActionResponseDto } from '../smartCar/dtos/actionResponse.dto';
import { CarActionDto } from './dtos/carAction.dto';
import { CarDto } from './dtos/car.dto';
import { Location } from 'smartcar';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BatteryCharge } from '../batteryCharge/batteryCharge.model';
import { Charge } from '../charge/charge.model';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCars(
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<CarDto[]> {
    return await this.carsService.getCarsAsync(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('location')
  async getLocation(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<Location> {
    return await this.carsService.getLocationAsync(userId, vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('lock')
  async lockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return await this.carsService.lockCarAsync(userId, vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('unlock')
  async unlockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return this.carsService.unlockCarAsync(userId, vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('startCharging')
  async startChargingCar(
    @Body() command: CarActionDto,
  ): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return this.carsService.startChargingCarAsync(userId, vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stopCharging')
  async stopChargingCar(
    @Body() command: CarActionDto,
  ): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return this.carsService.stopChargingCarAsync(userId, vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('chargingHistory')
  async getChargingHistory(
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<BatteryCharge[]> {
    return this.carsService.getChargingHistoryAsync(vehicleId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('charges')
  async getCharges(
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Query('date') date: string,
  ): Promise<Charge[]> {
    return this.carsService.getChargesAsync(vehicleId, date);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('disconnect')
  async disconnectCar(@Body() command: CarActionDto) {
    const { userId, vehicleId } = command;
    return this.carsService.disconnectCarAsync(userId, vehicleId);
  }
}
