import { IsDate, IsIn, IsUUID } from 'class-validator';

export class MetaDto {
  @IsDate()
  dataAge: Date;

  @IsUUID()
  requestId: string;

  @IsIn(['metric', 'imperial'])
  unitSystem: string;
}
