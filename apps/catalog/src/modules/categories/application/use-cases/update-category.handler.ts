import { UpdateCategoryDto } from '../../api/dtos/request/update-category.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { CategoryRepository } from '../../infrastructure/category.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { Category } from '../../domain/category.entity';

export class UpdateCategoryCommand {
  constructor(public readonly dto: UpdateCategoryDto & { id: number }) {}
}

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  extends BaseNotificationHandler<UpdateCategoryCommand, void>
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {
    super();
  }

  async executeHandler(command: UpdateCategoryCommand): Promise<void> {
    const { name, id } = command.dto;
    const category = await this.validate(id);

    Category.update(category, { name });
    await this.categoryRepository.save(category);
  }

  private async validate(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotificationException(`Category not found`, 'category', NotificationCode.NOT_FOUND);
    }
    return category;
  }
}
