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
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
    private readonly authService: AuthService,
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
      case 'challenge':
        const data = dto.payload as ChallengePayload;
        return this.authService.challenge(data.challenge);

      default:
        console.log(dto);
    }

    return null;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return await this.locationService.recordUserLocationAsync(dto);
  }
}
