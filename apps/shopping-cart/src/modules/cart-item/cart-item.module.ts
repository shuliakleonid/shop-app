import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../../../../libs/common/src/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './domain/cart-item.entity';
import { CartController } from './api/cart.controller';
import { CartItemRepository } from './infrastructure/cart-item.repository';
import { AddProductToCartUseCase } from './application/use-cases/add-product-to-cart.use-case';
import { AuthModule } from '../../../../main/src/modules/auth/auth.module';
import { ProductsRepository } from '../../../../catalog/src/modules/products/infrastructure/products.repository';
import { Product } from '../../../../catalog/src/modules/products/domain/product.entity';
import { Category } from '../../../../catalog/src/modules/categories/domain/category.entity';
import { UpdateProductInCartUseCase } from './application/use-cases/update-product-in-cart.use-case';
import { DeleteProductFromCartUseCase } from './application/use-cases/delete-product-from-cart.use-case';
import { CartItemQueryRepository } from './infrastructure/cart-item.query-repository';

const userCases = [AddProductToCartUseCase, UpdateProductInCartUseCase, DeleteProductFromCartUseCase];

@Module({
  imports: [AuthModule, CqrsModule, DatabaseModule, TypeOrmModule.forFeature([CartItem, Product, Category])],
  controllers: [CartController],
  providers: [CartItemRepository, ProductsRepository, CartItemQueryRepository, ...userCases],
})
export class CartItemModule {}
