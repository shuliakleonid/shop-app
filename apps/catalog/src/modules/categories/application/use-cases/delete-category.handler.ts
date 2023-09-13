import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { CategoryRepository } from '../../infrastructure/category.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { Category } from '../../domain/category.entity';

export class DeleteCategoryCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  extends BaseNotificationHandler<DeleteCategoryCommand, void>
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {
    super();
  }

  async executeHandler(command: DeleteCategoryCommand): Promise<void> {
    const { id } = command;

    const category = await this.validate(id);

    await this.categoryRepository.delete(category);
  }

  private async validate(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotificationException(`Category not found`, 'category', NotificationCode.NOT_FOUND);
    }
    return category;
  }
}
