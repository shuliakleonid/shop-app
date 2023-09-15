import { ApiProperty } from '@nestjs/swagger';

export class SessionExtendedDto {
  @ApiProperty()
  deviceId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  exp: number;

  @ApiProperty()
  ip: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  iat: number;
}
