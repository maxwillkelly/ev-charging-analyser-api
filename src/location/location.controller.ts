import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RecordLocation } from './dtos/recordLocation.dto';
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

  @Post()
  async recordLocation(@Body() dto: RecordLocation) {
    return this.locationService.recordLocation(dto);
  }
}
