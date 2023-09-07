import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { PaymentsModule } from './modules/payment-stripe/payments.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KafkaModule } from '@common/modules/kafka/kafka.module';

@Module({
  imports: [AuthModule, PrismaModule, PaymentsModule, PaymentModule, KafkaModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
