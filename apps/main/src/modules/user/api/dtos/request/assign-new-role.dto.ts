import { ApiProperty } from '@nestjs/swagger';
import { RoleTitle } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class AssignNewRoleDto {
  @ApiProperty()
  @IsEnum(RoleTitle)
  roleName: RoleTitle;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
