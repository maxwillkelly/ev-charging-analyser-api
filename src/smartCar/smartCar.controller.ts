import { Controller, Get, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SmartCarService } from './smartCar.service';
import { AttributesDto } from './dtos/attributes';
import { ExchangeStateDto } from './dtos/exchangeState.dto';

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
    @Query('state') state: string,
    // @Query('accessToken') accessToken: string,
  ): Promise<boolean | Error> {
    if (error) return new Error(error);

    const stateObj: ExchangeStateDto = JSON.parse(state);

    return await this.smartCarService.exchangeAsync(code, stateObj.userId);
  }

  @Get('vehicle')
  async getVehicleAttributes(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<AttributesDto> {
    return await this.smartCarService.getVehicleAttributesAsync(
      userId,
      vehicleId,
    );
  }
}
