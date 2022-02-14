import { Controller, Get, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SmartCarService } from './smartCar.service';
import { Access } from 'smartcar';
import { AttributesDto } from './dtos/attributes';

@Controller('smartCar')
export class SmartCarController {
  constructor(private readonly smartCarService: SmartCarService) {}

  @Get('login')
  login(@Res() response: Response) {
    const link = this.smartCarService.getAuthUrl();
    response.redirect(link);
  }

  @Get('exchange')
  async exchange(
    @Query('code') code: string,
    @Query('error') error: string,
  ): Promise<Access | Error> {
    if (error) return new Error(error);

    return this.smartCarService.exchange(code);
  }

  @Get('vehicle')
  async getVehicleAttributes(
    @Query('smartCarAccessToken', ParseUUIDPipe) smartCarAccessToken: string,
  ): Promise<AttributesDto> {
    return this.smartCarService.getVehicleAttributes(smartCarAccessToken);
  }
}
