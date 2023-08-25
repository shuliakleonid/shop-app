import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../../../libs/common/src/validators/result-notification';
import { CreateProductDto } from './dtos/request/create-product.dto';
import { CreateProductsCommand } from '../application/use-cases/create-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  getProducts() {
    return 'all products';
  }

  @Get('/:id')
  getProduct() {
    return 'one product';
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    const notification = await this.commandBus.execute<CreateProductsCommand, ResultNotification<null>>(
      new CreateProductsCommand(body),
    );
    return notification.getCode();
  }

  @Put('/:id')
  updateProduct() {}

  @Delete('/:id')
  deleteProduct() {}
}
