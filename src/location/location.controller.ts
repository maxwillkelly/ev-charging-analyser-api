import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SmartCarService } from 'src/smartCar/smartCar.service';
import {
  VerifyPayload,
  RecordCarLocationWebhook,
  SchedulePayload,
  VerifyWebhookDto,
} from './dtos/recordCarLocationWebhook.dto';
import { RecordUserLocation } from './dtos/recordUserLocation.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly smartCarService: SmartCarService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLocations() {
    return await this.locationService.getLocationsAsync();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLocation(@Query('id', ParseUUIDPipe) id: string) {
    return await this.locationService.getLocationByIdAsync(id);
  }

  @Post('car')
  async recordCarLocation(
    @Body() dto: RecordCarLocationWebhook,
  ): Promise<VerifyWebhookDto | boolean> {
    switch (dto.eventName) {
      case 'verify':
        const verifyPayload = dto.payload as VerifyPayload;

        const challenge = this.smartCarService.hashChallenge(
          verifyPayload.challenge,
        );

        return { challenge };

      case 'schedule':
        const schedulePayload = dto.payload as SchedulePayload;

        return await this.locationService.recordCarLocationWebhookAsync(
          schedulePayload,
        );

      default:
        console.log(JSON.stringify(dto, null, 2));
        return false;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return await this.locationService.recordUserLocationAsync(dto);
  }
}
