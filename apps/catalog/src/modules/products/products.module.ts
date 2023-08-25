import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../../libs/common/src/modules/database/database.module';
import { Product } from './domain/product.entity';
import { ProductsController } from './api/products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsRepository } from './infrastructure/products.repository';
import { CreateProductsUseCase } from './application/use-cases/create-products.use-case';
import { Category } from '../categories/domain/category.entity';

const useCases = [CreateProductsUseCase];

@Module({
  imports: [CqrsModule, DatabaseModule, TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsRepository, ...useCases],
  exports: [ProductsRepository],
})
export class ProductsModule {}
