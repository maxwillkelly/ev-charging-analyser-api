import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/smartCar/dtos/actionResponse.dto';
import { CarActionDto } from './dtos/carAction.dto';
import { CarDto } from './dtos/addCar.dto';
import { Location } from 'smartcar';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
}
