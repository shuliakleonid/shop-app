import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccessViewDto {
  @ApiProperty()
  accessToken: string;
}
