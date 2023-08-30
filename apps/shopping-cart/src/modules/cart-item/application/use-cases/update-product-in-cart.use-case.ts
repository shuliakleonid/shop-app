import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { CartItem } from '../../domain/cart-item.entity';
import { CartItemRepository } from '../../infrastructure/cart-item.repository';
import { ProductsRepository } from '../../../../../../catalog/src/modules/products/infrastructure/products.repository';
import { NotificationCode } from '../../../../../../../libs/common/src/configuration/notificationCode';
import { NotificationException } from '../../../../../../../libs/common/src/validators/result-notification';
import { UpdateCartDto } from '../../api/dtos/request/update-cart.dto';

export class UpdateProductInCartCommand {
  constructor(public readonly dto: UpdateCartDto & { customerId: number }) {}
}

@CommandHandler(UpdateProductInCartCommand)
export class UpdateProductInCartUseCase
  extends BaseNotificationUseCase<UpdateProductInCartCommand, void>
  implements ICommandHandler<UpdateProductInCartCommand>
{
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductsRepository,
  ) {
    super();
  }

  async executeUseCase(command: UpdateProductInCartCommand): Promise<void> {
    const { productId, customerId, quantity } = command.dto;

    const productInCart = await this.validateProduct(productId, customerId);

    const cartItemEntity = CartItem.update(productInCart, quantity);
    await this.cartItemRepository.save(cartItemEntity);
  }

  private async validateProduct(productId: number, customerId: number) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotificationException(`Product with id ${productId} not found`, 'product', NotificationCode.NOT_FOUND);
    }

    const productInCart = await this.cartItemRepository.findOneByProduct(productId, customerId);

    if (!productInCart) {
      throw new NotificationException(
        `Product with id ${productId} not in cart`,
        'product',
        NotificationCode.NOT_FOUND,
      );
    }
    return productInCart;
  }
}
