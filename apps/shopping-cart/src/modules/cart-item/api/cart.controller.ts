import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@main/modules/auth/api/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/user.decorator';
import { ResultNotification } from '@common/validators/result-notification';
import { AddProductToCartDto } from './dtos/request/add-product-to-cart.dto';
import { AddProductToCartCommand } from '../application/use-cases/add-product-to-cart.use-case';
import { UpdateCartDto } from './dtos/request/update-cart.dto';
import { UpdateProductInCartCommand } from '../application/use-cases/update-product-in-cart.use-case';
import { DeleteProductFromCartCommand } from '../application/use-cases/delete-product-from-cart.use-case';
import { CartItemQueryRepository } from '../infrastructure/cart-item.query-repository';
import { CartDto } from './dtos/response/cart.dto';
import { UseRoles } from 'nest-access-control';

@Controller('cart')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cartItemQueryRepository: CartItemQueryRepository,
  ) {}

  @UseRoles({
    resource: 'customerData',
    action: 'read',
    possession: 'any',
  })
  @Get()
  async getCart(@CurrentUser() customer) {
    const cartItems = await this.cartItemQueryRepository.getCustomerCartItems(customer.userId);
    return new CartDto(cartItems);
  }

  @UseRoles({
    resource: 'customerData',
    action: 'create',
    possession: 'any',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addProductToCart(@Body() body: AddProductToCartDto, @CurrentUser() customer) {
    const notification = await this.commandBus.execute<AddProductToCartCommand, ResultNotification<null>>(
      new AddProductToCartCommand({ ...body, customerId: customer.userId }),
    );
    notification.getCode();
  }

  @UseRoles({
    resource: 'customerData',
    action: 'update',
    possession: 'any',
  })
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateProductInCart(@Body() body: UpdateCartDto, @CurrentUser() customer) {
    const notification = await this.commandBus.execute<UpdateProductInCartCommand, ResultNotification<null>>(
      new UpdateProductInCartCommand({ ...body, customerId: customer.userId }),
    );
    notification.getCode();
  }

  @UseRoles({
    resource: 'customerData',
    action: 'delete',
    possession: 'any',
  })
  @Delete('/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProductFromCart(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() customer) {
    const notification = await this.commandBus.execute<DeleteProductFromCartCommand, ResultNotification<null>>(
      new DeleteProductFromCartCommand({
        productId,
        customerId: customer.userId,
      }),
    );
    notification.getCode();
  }
}
