import { Module } from '@nestjs/common';
import { ApiJwtService } from './api-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '@common/modules/api-config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.ACCESS_TOKEN_SECRET', { infer: true }),
          signOptions: { expiresIn: configService.get('jwt.EXPIRED_ACCESS', { infer: true }) },
        };
      },
    }),
  ],
  providers: [ApiJwtService],
  exports: [ApiJwtService],
})
export class ApiJwtModule {}
