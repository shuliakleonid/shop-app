import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiErrorResultDto } from '../../../../../../libs/common/src/validators/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../../../../libs/common/src/configuration/swagger/helpers/token-type-swagger.dto';

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
