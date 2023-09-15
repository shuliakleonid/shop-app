import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class MeViewDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  constructor(user: User) {
    this.userId = user.id;
    this.userName = user.userName;
    this.email = user.email;
  }
}
