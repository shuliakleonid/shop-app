import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';
import { RoleTitle } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<{ userId: number; roles: RoleTitle[] }> {
    const user = await this.authService.checkCredentialsOfCustomer({ email, password });
    if (!user) throw new UnauthorizedException('');

    const userIsAdmin = user.roleId === 2;

    let userRole: RoleTitle = RoleTitle.CUSTOMER;
    if (userIsAdmin) userRole = RoleTitle.ADMINISTRATOR;

    return {
      userId: user.id,
      roles: [userRole],
    };
  }
}
