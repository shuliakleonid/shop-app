import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiErrorResultDto } from '../../../../../../libs/common/src/validators/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../../../../libs/common/src/configuration/swagger/helpers/token-type-swagger.dto';
import { MeViewDto } from '../api/dtos/response/me.dto';

export function SwaggerDecoratorsByRegistration(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Registration in the systems.',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Customer is registered in system ',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
export function SwaggerDecoratorsByLogin(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'success',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Incorrect input data',
      type: ApiErrorResultDto,
    }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}

export function SwaggerDecoratorsByLogout(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'In cookie client must send correct refresh Token that will be revoked',
    }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'success' }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
export function SwaggerDecoratorsByUpdateTokens(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary:
        " 'Generate new pair of access and refresh tokens (in cookie client must send correct refresh Token that will be revoked after refreshing) Device LastActiveDate should\\n' +\n" +
        "'be overrode by issued Date of new refresh token',",
    }),
    ApiResponse({
      status: 200,
      description: 'success',
      type: TokenTypeSwaggerDto,
    }),
    ApiResponse({
      status: 401,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
export function SwaggerDecoratorsByMe(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Get information about current customer',
    }),
    ApiResponse({ status: HttpStatus.OK, description: 'success', type: MeViewDto }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
    ApiBearerAuth(),
  );
}
