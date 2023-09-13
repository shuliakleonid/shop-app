import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DevicesViewModel } from '../api/session.view.dto';

export function SwaggerDecoratorsByGetUserSessions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user sessions',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'The user sessions have been successfully retrieved',
      type: DevicesViewModel,
    }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
  );
}
export function SwaggerDecoratorsByDeleteSelectedSession() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete selected device',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The session has been successfully deleted',
    }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
  );
}

export function SwaggerDecoratorsByDeleteAllSessionsExceptCurrent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete all sessions except current',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The sessions have been successfully deleted',
    }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
  );
}
