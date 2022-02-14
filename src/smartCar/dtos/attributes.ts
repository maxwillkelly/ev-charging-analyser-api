import { IsInt, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MetaDto } from './meta.dto';

export class AttributesDto {
  @IsUUID()
  id: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @ValidateNested()
  meta: MetaDto;
}
