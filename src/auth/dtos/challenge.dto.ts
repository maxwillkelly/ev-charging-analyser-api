import { IsString } from 'class-validator';

export class ChallengeDto {
  @IsString()
  signature: string;
}
