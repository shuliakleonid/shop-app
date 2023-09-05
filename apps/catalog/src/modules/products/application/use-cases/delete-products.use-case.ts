import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { Product } from '../../domain/product.entity';
import { ProductsRepository } from '../../infrastructure/products.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

export class DeleteProductsCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteProductsCommand)
export class DeleteProductsUseCase
  extends BaseNotificationUseCase<DeleteProductsCommand, void>
  implements ICommandHandler<DeleteProductsCommand>
{
  constructor(private readonly productsRepository: ProductsRepository) {
    super();
  }

  async executeUseCase(command: DeleteProductsCommand): Promise<void> {
    const { id } = command;

    const product = await this.validate(id);

    await this.productsRepository.delete(product);
  }

  private async validate(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotificationException(`Product not found`, 'product', NotificationCode.NOT_FOUND);
    }
    return product;
  }
}
