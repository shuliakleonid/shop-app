import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty()
  deviceId: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}
