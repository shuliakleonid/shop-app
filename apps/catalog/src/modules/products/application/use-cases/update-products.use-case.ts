import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { Product } from '../../domain/product.entity';
import { ProductsRepository } from '../../infrastructure/products.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

export class UpdateProductsCommand {
  constructor(
    public readonly dto: {
      name: string;
      price: number;
      description: string;
      quantity: number;
    } & { id: number },
  ) {}
}

@CommandHandler(UpdateProductsCommand)
export class UpdateProductsUseCase
  extends BaseNotificationUseCase<UpdateProductsCommand, void>
  implements ICommandHandler<UpdateProductsCommand>
{
  constructor(private readonly productsRepository: ProductsRepository) {
    super();
  }

  async executeUseCase(command: UpdateProductsCommand): Promise<void> {
    const { name, price, description, id, quantity } = command.dto;
    const product = await this.validate(id);

    Product.update(product, { name, description, price, quantity });
    await this.productsRepository.save(product);
  }

  private async validate(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotificationException(`Product not found`, 'product', NotificationCode.NOT_FOUND);
    }
    return product;
  }
}
