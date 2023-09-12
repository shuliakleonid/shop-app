import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@common/modules/api-config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('database.DATABASE_URL', { infer: true });
        const regex = /localhost/;
        const isSsl = !regex.test(url);
        return {
          autoLoadEntities: true,
          synchronize: true,
          type: 'postgres',
          url: url,
          ssl: isSsl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
