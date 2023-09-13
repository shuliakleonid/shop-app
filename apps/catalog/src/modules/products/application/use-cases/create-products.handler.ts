import { CreateProductDto } from '../../api/dtos/request/create-product.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { Product } from '../../domain/product.entity';
import { ProductsRepository } from '../../infrastructure/products.repository';

export class CreateProductsCommand {
  constructor(public readonly dto: CreateProductDto) {}
}

@CommandHandler(CreateProductsCommand)
export class CreateProductsHandler
  extends BaseNotificationHandler<CreateProductsCommand, void>
  implements ICommandHandler<CreateProductsCommand>
{
  constructor(private readonly productsRepository: ProductsRepository) {
    super();
  }

  async executeHandler(command: CreateProductsCommand): Promise<void> {
    const { name, price, description, categoryId } = command.dto;

    const productEntity = Product.create({ name, description, price });
    await this.productsRepository.save(productEntity);
  }
}
