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
import { RecordUserLocation } from './dtos/recordUserLocation.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return await this.locationService.recordUserLocationAsync(dto);
  }
}
