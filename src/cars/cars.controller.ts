import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActionResponseDto } from 'src/smartCar/dtos/actionResponse.dto';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import { CarActionDto } from './dtos/carAction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCarDto, CarDto, NewCarDto } from './dtos/addCar.dto';
import { Location } from 'smartcar';

@Controller('cars')
export class CarsController {
  constructor(
    private readonly smartCarService: SmartCarService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('add')
  async addCar(@Body() command: AddCarDto): Promise<CarDto> {
    return await this.prismaService.car.create({ data: command });
  }

  @Get(':smartCarAccessToken')
  async getCars(
    @Param('smartCarAccessToken') smartCarAccessToken: string,
  ): Promise<NewCarDto[]> {
    const vehicles = await this.smartCarService.getVehicles(
      smartCarAccessToken,
    );

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

  @Get('location/:smartCarAccessToken')
  async getLocation(
    @Param('smartCarAccessToken') smartCarAccessToken: string,
  ): Promise<Location> {
    const response = await this.smartCarService.getLocation(
      smartCarAccessToken,
    );

    return response;
  }

  @Post('lock')
  async lockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const response = this.smartCarService.lockCar(command.smartCarAccessToken);

    return response;
  }

  @Post('unlock')
  async unlockCar(@Body() command: CarActionDto): Promise<ActionResponseDto> {
    const response = this.smartCarService.unlockCar(
      command.smartCarAccessToken,
    );

    return response;
  }
}
