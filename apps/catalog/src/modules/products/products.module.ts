import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/modules/database/database.module';
import { Product } from './domain/product.entity';
import { ProductsController } from './api/products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsRepository } from './infrastructure/products.repository';
import { CreateProductsHandler } from './application/use-cases/create-products.handler';
import { Category } from '../categories/domain/category.entity';
import { PublicProductsController } from './api/public-products.controller';
import { ProductsQueryRepository } from './infrastructure/products.query-repository';
import { UpdateProductsHandler } from './application/use-cases/update-products.handler';
import { DeleteProductsHandler } from './application/use-cases/delete-products.handler';
import { CreateCategoryHandler } from '../categories/application/use-cases/create-category.handler';
import { UpdateCategoryHandler } from '../categories/application/use-cases/update-category.handler';
import { DeleteCategoryHandler } from '../categories/application/use-cases/delete-category.handler';
import { CategoryController } from '../categories/api/category.controller';
import { PublicCategoryController } from '../categories/api/public-category.controller';
import { CategoryRepository } from '../categories/infrastructure/category.repository';
import { CategoryQueryRepository } from '../categories/infrastructure/category.query-repository';

const useCases = [
  CreateProductsHandler,
  UpdateProductsHandler,
  DeleteProductsHandler,
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

@Module({
  imports: [CqrsModule, DatabaseModule, TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController, PublicProductsController, CategoryController, PublicCategoryController],

  providers: [ProductsRepository, ProductsQueryRepository, CategoryRepository, CategoryQueryRepository, ...useCases],
  exports: [ProductsRepository],
})
export class ProductsModule {}
