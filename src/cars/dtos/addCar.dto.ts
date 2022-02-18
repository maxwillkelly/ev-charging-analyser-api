import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';
import { AttributesDto } from 'src/smartCar/dtos/attributes';

export class AddCarDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  accessToken: string;

  @IsUUID()
  refreshToken: string;

  @IsDateString()
  expiration: string;

  @IsDateString()
  refreshExpiration: string;
}

export class CarDto extends AttributesDto {
  @IsString()
  name: string;

  @IsNumber()
  percentRemaining: number;

  @IsNumber()
  range: number;
}
