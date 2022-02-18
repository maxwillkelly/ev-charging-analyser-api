import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/smartCar/dtos/actionResponse.dto';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarActionDto } from './dtos/carAction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarDto } from './dtos/addCar.dto';
import { Location } from 'smartcar';

@Controller('cars')
export class CarsController {
  constructor(
    private readonly smartCarService: SmartCarService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getCars(
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<CarDto[]> {
    const vehicles = await this.smartCarService.getVehiclesAsync(userId);

    const cars = Promise.all(
      vehicles.map(async (v) => {
        const attributes = await v.attributes();
        const batteryLevel = await v.battery();

        const { make, model, year } = attributes;
        const name = `${year} ${make} ${model}`;

        return { ...attributes, ...batteryLevel, name };
      }),
    );

    return cars;
  }

  @Get('location')
  async getLocation(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<Location> {
    const response = await this.smartCarService.getLocationAsync(
      userId,
      vehicleId,
    );

    return response;
  }

  @Post('lock')
  async lockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return await this.smartCarService.lockCarAsync(userId, vehicleId);
  }

  @Post('unlock')
  async unlockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const { userId, vehicleId } = command;
    return this.smartCarService.unlockCarAsync(userId, vehicleId);
  }
}
