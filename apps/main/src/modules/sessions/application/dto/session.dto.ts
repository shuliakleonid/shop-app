import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty()
  deviceId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}
