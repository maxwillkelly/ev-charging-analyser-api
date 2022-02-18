import { Controller, Get, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SmartCarService } from './smartCar.service';
import { AttributesDto } from './dtos/attributes';

@Controller('smartCar')
export class SmartCarController {
  constructor(private readonly smartCarService: SmartCarService) {}

  @Get('login')
  login(@Res() response: Response, @Query('userId') userId: string) {
    const link = this.smartCarService.getAuthUrl(userId);
    response.redirect(link);
  }

  @Get('exchange')
  async exchange(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('userId') userId: string,
    // @Query('accessToken') accessToken: string,
  ): Promise<boolean | Error> {
    if (error) return new Error(error);

    return await this.smartCarService.exchangeAsync(code, userId);
  }

  @Get('vehicle')
  async getVehicleAttributes(
    @Query('smartCarAccessToken', ParseUUIDPipe) smartCarAccessToken: string,
  ): Promise<AttributesDto> {
    return this.smartCarService.getVehicleAttributes(smartCarAccessToken);
  }
}
