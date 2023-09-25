import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule } from '@nestjs/config';
import mainConfig from '@common/modules/api-config/main.config';
import { AccessControlModule, ACGuard } from 'nest-access-control';
import { RBAC_POLICY } from '@main/modules/auth/rbac-policy';
import { APP_GUARD } from '@nestjs/core';
import { SessionGuard } from '@main/modules/auth/api/guards/session.guard';
import { ApiJwtService } from '@main/modules/api-jwt/api-jwt.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '@main/modules/sessions/infrastructure/sessions-repository';
import jwtConfig from '@common/modules/api-config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [mainConfig, jwtConfig] }),
    AccessControlModule.forRoles(RBAC_POLICY),
    PrismaModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ACGuard,
    },
    ApiJwtService,
    JwtService,
    SessionsRepository,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
