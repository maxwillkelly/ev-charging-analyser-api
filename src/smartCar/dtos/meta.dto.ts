import { IsDate, IsIn, IsUUID } from 'class-validator';
import { UnitSystem } from 'smartcar';

export class MetaDto {
  @IsDate()
  dataAge: Date;

  @IsUUID()
  requestId: string;

  @IsIn(['metric', 'imperial'])
  unitSystem: UnitSystem;
}
