import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/modules/database/database.module';
import { Product } from './domain/product.entity';
import { ProductsController } from './api/products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsRepository } from './infrastructure/products.repository';
import { CreateProductsUseCase } from './application/use-cases/create-products.use-case';
import { Category } from '../categories/domain/category.entity';
import { PublicProductsController } from './api/public-products.controller';
import { ProductsQueryRepository } from './infrastructure/products.query-repository';
import { UpdateProductsUseCase } from './application/use-cases/update-products.use-case';
import { DeleteProductsUseCase } from './application/use-cases/delete-products.use-case';
import { CreateCategoryUseCase } from '../categories/application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../categories/application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../categories/application/use-cases/delete-category.use-case';
import { CategoryController } from '../categories/api/category.controller';
import { PublicCategoryController } from '../categories/api/public-category.controller';
import { CategoryRepository } from '../categories/infrastructure/category.repository';
import { CategoryQueryRepository } from '../categories/infrastructure/category.query-repository';

const useCases = [
  CreateProductsUseCase,
  UpdateProductsUseCase,
  DeleteProductsUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
];

@Module({
  imports: [CqrsModule, DatabaseModule, TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController, PublicProductsController, CategoryController, PublicCategoryController],

  providers: [ProductsRepository, ProductsQueryRepository, CategoryRepository, CategoryQueryRepository, ...useCases],
  exports: [ProductsRepository],
})
export class ProductsModule {}
