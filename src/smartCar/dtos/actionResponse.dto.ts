import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { MetaDto } from './meta.dto';

export class ActionResponseDto {
  @IsString()
  status: string;

  // @IsOptional()
  // @IsString()
  // message: string;

  @ValidateNested()
  meta: MetaDto;
}
