import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<{ customerId: number }> {
    const customerId = await this.authService.checkCredentialsOfCustomer({ email, password });
    if (!customerId) throw new UnauthorizedException();

    return { customerId };
  }
}
