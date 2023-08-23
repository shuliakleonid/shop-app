import { ApiProperty, PickType } from '@nestjs/swagger';

class TokensType {
  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class TokenTypeSwaggerDto extends PickType(TokensType, ['accessToken'] as const) {}
