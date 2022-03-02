import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ChargeState } from 'smartcar';
import { MetaDto } from 'src/smartCar/dtos/meta.dto';

export class CarDto {
  @IsUUID()
  id: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @IsString()
  name: string;

  @IsNumber()
  percentRemaining: number;

  @IsNumber()
  range: number;

  @IsBoolean()
  isPluggedIn: boolean;

  @IsIn(['CHARGING', 'FULLY_CHARGED', 'NOT_CHARGING'])
  state: ChargeState;

  @ValidateNested()
  meta: MetaDto;
}
