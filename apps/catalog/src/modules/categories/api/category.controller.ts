import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../../../libs/common/src/validators/result-notification';
import { CreateCategoryDto } from './dtos/request/create-category.dto';
import { CreateCategoryCommand } from '../application/use-cases/create-category.use-case';
import { UpdateCategoryDto } from './dtos/request/update-category.dto';
import { UpdateCategoryCommand } from '../application/use-cases/update-category.use-case';
import { DeleteCategoryCommand } from '../application/use-cases/delete-category.use-case';

@Controller('category')
export class CategoryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createProduct(@Body() body: CreateCategoryDto) {
    const notification = await this.commandBus.execute<CreateCategoryCommand, ResultNotification<null>>(
      new CreateCategoryCommand(body),
    );
    return notification.getCode();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() body: UpdateCategoryDto, @Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<UpdateCategoryCommand, ResultNotification<null>>(
      new UpdateCategoryCommand({ ...body, id }),
    );
    notification.getCode();
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<DeleteCategoryCommand, ResultNotification<null>>(
      new DeleteCategoryCommand(id),
    );
    notification.getCode();
  }
}
