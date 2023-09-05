import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/validators/result-notification';
import { CreateProductDto } from './dtos/request/create-product.dto';
import { CreateProductsCommand } from '../application/use-cases/create-products.use-case';
import { UpdateProductDto } from './dtos/request/update-product.dto';
import { UpdateProductsCommand } from '../application/use-cases/update-products.use-case';
import { DeleteProductsCommand } from '../application/use-cases/delete-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    const notification = await this.commandBus.execute<CreateProductsCommand, ResultNotification<null>>(
      new CreateProductsCommand(body),
    );
    return notification.getCode();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() body: UpdateProductDto, @Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<UpdateProductsCommand, ResultNotification<null>>(
      new UpdateProductsCommand({ ...body, id }),
    );
    notification.getCode();
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<DeleteProductsCommand, ResultNotification<null>>(
      new DeleteProductsCommand(id),
    );
    notification.getCode();
  }
}
