import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '@common/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './domain/cart-item.entity';
import { CartController } from './api/cart.controller';
import { CartItemRepository } from './infrastructure/cart-item.repository';
import { AddProductToCartHandler } from './application/use-cases/add-product-to-cart.use-case';
import { AuthModule } from '@main/modules/auth/auth.module';
import { ProductsRepository } from '@catalog/modules/products/infrastructure/products.repository';
import { Product } from '@catalog/modules/products/domain/product.entity';
import { Category } from '@catalog/modules/categories/domain/category.entity';
import { UpdateProductInCartHandler } from './application/use-cases/update-product-in-cart.use-case';
import { DeleteProductFromCartHandler } from './application/use-cases/delete-product-from-cart.use-case';
import { CartItemQueryRepository } from './infrastructure/cart-item.query-repository';

const userCases = [AddProductToCartHandler, UpdateProductInCartHandler, DeleteProductFromCartHandler];

@Module({
  imports: [AuthModule, CqrsModule, DatabaseModule, TypeOrmModule.forFeature([CartItem, Product, Category])],
  controllers: [CartController],
  providers: [CartItemRepository, , ProductsRepository, CartItemQueryRepository, ...userCases],
})
export class CartItemModule {}
