import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RecordCarLocation } from './dtos/recordCarLocation.dto';
import { RecordUserLocation } from './dtos/recordUserLocation.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  async getLocations() {
    return this.locationService.getLocations();
  }

  @Get(':id')
  async getLocation(@Query('id', ParseUUIDPipe) id: string) {
    return this.locationService.getLocationById(id);
  }

  @Post('car')
  async recordCarLocation(@Body() dto: RecordCarLocation) {
    return this.locationService.recordCarLocation(dto);
  }

  @Post('user')
  async recordUserLocation(@Body() dto: RecordUserLocation) {
    return this.locationService.recordUserLocation(dto);
  }
}
