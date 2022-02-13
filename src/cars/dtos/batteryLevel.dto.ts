import { IsNumber } from 'class-validator';

export class BatteryLevelDto {
  @IsNumber()
  percentRemaining: number;

  @IsNumber()
  range: number;
}
