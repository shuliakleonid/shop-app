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

@Module({
  imports: [
    ConfigModule.forRoot({ load: [mainConfig] }),
    AuthModule,
    PrismaModule,
    PaymentsModule,
    PaymentModule,
    KafkaModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
