import { IsUUID, ValidateNested } from 'class-validator';
import { MetaDto } from './meta.dto';

export class SmartCarAPIUserDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  meta: MetaDto;
}
