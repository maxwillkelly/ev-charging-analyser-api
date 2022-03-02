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
  ChallengePayload,
  RecordCarLocation,
} from './dtos/recordCarLocation.dto';
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
  async recordCarLocation(@Body() dto: RecordCarLocation) {
    switch (dto.eventName) {
      case 'verify':
        const data = dto.payload as ChallengePayload;
        return {
          challenge: this.smartCarService.hashChallenge(data.challenge),
        };

      default:
        console.log(JSON.stringify(dto, null, 2));
        return null;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return await this.locationService.recordUserLocationAsync(dto);
  }
}
