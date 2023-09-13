import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { AddProductToCartDto } from '../../api/dtos/request/add-product-to-cart.dto';
import { CartItem } from '../../domain/cart-item.entity';
import { CartItemRepository } from '../../infrastructure/cart-item.repository';
import { ProductsRepository } from '@catalog/modules/products/infrastructure/products.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { NotificationException } from '@common/validators/result-notification';

export class AddProductToCartCommand {
  constructor(public readonly dto: AddProductToCartDto & { customerId: number }) {}
}

@CommandHandler(AddProductToCartCommand)
export class AddProductToCartHandler
  extends BaseNotificationHandler<AddProductToCartCommand, void>
  implements ICommandHandler<AddProductToCartCommand>
{
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductsRepository,
  ) {
    super();
  }

  async executeHandler(command: AddProductToCartCommand): Promise<void> {
    const { productId, customerId, quantity } = command.dto;

    await this.validateProduct(productId);

    let cartProduct = await this.cartItemRepository.findOneByProduct(productId, customerId);

    if (cartProduct) {
      CartItem.update(cartProduct, quantity);
    } else {
      cartProduct = CartItem.create(command.dto);
    }

    await this.cartItemRepository.save(cartProduct);
  }

  private async validateProduct(productId: number) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotificationException(`Product with id ${productId} not found`, 'product', NotificationCode.NOT_FOUND);
    }
  }
}
