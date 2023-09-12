import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginInputDto } from '../modules/auth/api/dtos/request/login.dto';

@Injectable()
export class CheckLoginBodyFieldsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const object2 = plainToInstance(LoginInputDto, req.body);
    const res = await validate(object2, { stopAtFirstError: true });

    const err = [];
    res.forEach(item => {
      err.push({ message: item.constraints, field: item.property });
    });

    if (res.length > 0) throw new BadRequestException(err);

    return true;
  }
}
