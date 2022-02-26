import { IsString, IsUUID } from 'class-validator';

export class ChallengeDto {
  @IsString()
  challenge: string;

  @IsUUID()
  applicationManagementToken: string;
}
