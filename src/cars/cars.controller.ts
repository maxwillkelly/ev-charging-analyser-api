import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActionResponseDto } from 'src/smartCar/dtos/actionResponse.dto';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarActionDto } from './dtos/carAction.dto';
import { CarDto } from './dtos/addCar.dto';
import { Location } from 'smartcar';

@Controller('cars')
export class CarsController {
  constructor(private readonly smartCarService: SmartCarService) {}

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
    return await this.smartCarService.getLocationAsync(userId, vehicleId);
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
