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
import { RecordCarLocation } from './dtos/recordCarLocation.dto';
import { RecordUserLocation } from './dtos/recordUserLocation.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLocations() {
    return this.locationService.getLocations();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLocation(@Query('id', ParseUUIDPipe) id: string) {
    return this.locationService.getLocationById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('car')
  async recordCarLocation(@Body() dto: RecordCarLocation) {
    return this.locationService.recordCarLocation(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return this.locationService.recordUserLocation(dto);
  }
}
