import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { PaymentsModule } from './modules/payment-stripe/payments.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import mainConfig from '@common/modules/api-config/main.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@main/modules/user/user.module';
import { RBAC_POLICY } from '@main/modules/auth/rbac-policy';
import { AccessControlModule, ACGuard } from 'nest-access-control';
import { APP_GUARD } from '@nestjs/core';
import { SessionGuard } from '@main/modules/auth/api/guards/session.guard';
import { SessionsRepository } from '@main/modules/sessions/infrastructure/sessions-repository';
import { ApiJwtService } from '@main/modules/api-jwt/api-jwt.service';
import jwtConfig from '@common/modules/api-config/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [mainConfig, jwtConfig] }),
    AccessControlModule.forRoles(RBAC_POLICY),
    AuthModule,
    PrismaModule,
    PaymentsModule,
    UserModule,
    PaymentModule,
    KafkaModule,
    EventEmitterModule.forRoot(),
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
export class AppModule {}
