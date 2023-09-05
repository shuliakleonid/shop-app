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
import { JwtAuthGuard } from '../../../../../main/src/modules/auth/api/guards/jwt-auth.guard';
import { CurrentCustomerId } from '@common/decorators/user.decorator';
import { ResultNotification } from '@common/validators/result-notification';
import { AddProductToCartDto } from './dtos/request/add-product-to-cart.dto';
import { AddProductToCartCommand } from '../application/use-cases/add-product-to-cart.use-case';
import { UpdateCartDto } from './dtos/request/update-cart.dto';
import { UpdateProductInCartCommand } from '../application/use-cases/update-product-in-cart.use-case';
import { DeleteProductFromCartCommand } from '../application/use-cases/delete-product-from-cart.use-case';
import { CartItemQueryRepository } from '../infrastructure/cart-item.query-repository';
import { CartDto } from './dtos/response/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cartItemQueryRepository: CartItemQueryRepository,
  ) {}

  @Get()
  async getCart(@CurrentCustomerId() customerId: number) {
    const cartItems = await this.cartItemQueryRepository.getCustomerCartItems(customerId);
    return new CartDto(cartItems);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addProductToCart(@Body() body: AddProductToCartDto, @CurrentCustomerId() customerId: number) {
    const notification = await this.commandBus.execute<AddProductToCartCommand, ResultNotification<null>>(
      new AddProductToCartCommand({ ...body, customerId }),
    );
    notification.getCode();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateProductInCart(@Body() body: UpdateCartDto, @CurrentCustomerId() customerId: number) {
    const notification = await this.commandBus.execute<UpdateProductInCartCommand, ResultNotification<null>>(
      new UpdateProductInCartCommand({ ...body, customerId }),
    );
    notification.getCode();
  }

  @Delete('/:productId')
  @HttpCode(HttpStatus.OK)
  async removeProductFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentCustomerId() customerId: number,
  ) {
    const notification = await this.commandBus.execute<DeleteProductFromCartCommand, ResultNotification<null>>(
      new DeleteProductFromCartCommand({
        productId,
        customerId,
      }),
    );
    notification.getCode();
  }
}
