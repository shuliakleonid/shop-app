import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { customerFieldParameters } from '@main/modules/user/domain/user.entity';

export class RegisterInputDto {
  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(customerFieldParameters.userNameLength.min, customerFieldParameters.userNameLength.max)
  @IsString()
  @Matches('^[a-zA-Z0-9_-]*$', undefined, {
    message: 'The username should contain only latin letters, numbers and the following characters: "-" and "_"',
  })
  userName: string;

  @ApiProperty({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  @IsEmail()
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(6, 20)
  @IsString()
  password: string;
}
