import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/smartCar/dtos/actionResponse.dto';
import { CarActionDto } from './dtos/carAction.dto';
import { CarDto } from './dtos/addCar.dto';
import { Location } from 'smartcar';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getCars(
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<CarDto[]> {
    return await this.carsService.getCarsAsync(userId);
  }

  @Get('location')
  async getLocation(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<Location> {
    return await this.carsService.getLocationAsync(userId, vehicleId);
  }

  @Post('lock')
  async lockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return await this.carsService.lockCarAsync(userId, vehicleId);
  }

  @Post('unlock')
  async unlockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return this.carsService.unlockCarAsync(userId, vehicleId);
  }
}
