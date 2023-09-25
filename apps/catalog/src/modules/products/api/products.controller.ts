import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/validators/result-notification';
import { CreateProductDto } from './dtos/request/create-product.dto';
import { CreateProductsCommand } from '../application/use-cases/create-products.handler';
import { UpdateProductDto } from './dtos/request/update-product.dto';
import { UpdateProductsCommand } from '../application/use-cases/update-products.handler';
import { DeleteProductsCommand } from '../application/use-cases/delete-products.handler';
import { UseRoles } from 'nest-access-control';

@Controller('products')
export class ProductsController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseRoles({
    resource: 'adminData',
    action: 'create',
    possession: 'any',
  })
  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    const notification = await this.commandBus.execute<CreateProductsCommand, ResultNotification<null>>(
      new CreateProductsCommand(body),
    );
    return notification.getCode();
  }

  @UseRoles({
    resource: 'adminData',
    action: 'update',
    possession: 'any',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() body: UpdateProductDto, @Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<UpdateProductsCommand, ResultNotification<null>>(
      new UpdateProductsCommand({ ...body, id }),
    );
    notification.getCode();
  }

  @UseRoles({
    resource: 'adminData',
    action: 'delete',
    possession: 'any',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<DeleteProductsCommand, ResultNotification<null>>(
      new DeleteProductsCommand(id),
    );
    notification.getCode();
  }
}
