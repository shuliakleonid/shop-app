import { SessionDto } from '../../../../sessions/application/dto/session.dto';

export class GenerateNewTokensDto {
  oldSessionData: SessionDto;
  ip: string;
  deviceName: string;
}
