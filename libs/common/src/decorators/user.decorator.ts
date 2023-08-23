import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCustomerId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user ? +req.user.customerId : null;
});
