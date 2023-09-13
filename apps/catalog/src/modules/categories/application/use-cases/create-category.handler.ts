import { CreateCategoryDto } from '../../api/dtos/request/create-category.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { CategoryRepository } from '../../infrastructure/category.repository';
import { Category } from '../../domain/category.entity';

export class CreateCategoryCommand {
  constructor(public readonly dto: CreateCategoryDto) {}
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  extends BaseNotificationHandler<CreateCategoryCommand, void>
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {
    super();
  }

  async executeHandler(command: CreateCategoryCommand): Promise<void> {
    const { name } = command.dto;

    const categoryEntity = Category.create({ name });
    await this.categoryRepository.save(categoryEntity);
  }
}
