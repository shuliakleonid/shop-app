import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RoleTitle } from '@prisma/client';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class CreateRoleDto {
  @ApiProperty()
  @IsEnum(RoleTitle)
  name: RoleTitle;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  description?: string;
}
