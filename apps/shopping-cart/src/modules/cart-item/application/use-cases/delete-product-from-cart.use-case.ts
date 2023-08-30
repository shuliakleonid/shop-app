import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { ProductsRepository } from '../../../../../../catalog/src/modules/products/infrastructure/products.repository';
import { NotificationException } from '../../../../../../../libs/common/src/validators/result-notification';
import { NotificationCode } from '../../../../../../../libs/common/src/configuration/notificationCode';
import { CartItemRepository } from '../../infrastructure/cart-item.repository';

export class DeleteProductFromCartCommand {
  constructor(public readonly dto: { productId: number; customerId: number }) {}
}

@CommandHandler(DeleteProductFromCartCommand)
export class DeleteProductFromCartUseCase
  extends BaseNotificationUseCase<DeleteProductFromCartCommand, void>
  implements ICommandHandler<DeleteProductFromCartCommand>
{
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductsRepository,
  ) {
    super();
  }
  async executeUseCase(command: DeleteProductFromCartCommand): Promise<void> {
    const { productId, customerId } = command.dto;

    const productInCart = await this.validateProduct(productId, customerId);

    await this.cartItemRepository.delete(productInCart);
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
