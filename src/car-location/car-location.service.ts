import { Injectable } from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { SmartCarService } from 'src/smartCar/smartCar.service';

@Injectable()
export class CarLocationService {
  constructor(
    private smartCarService: SmartCarService,
    private locationService: LocationService,
  ) {}

  
}
