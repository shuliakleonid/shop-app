import { Logger } from '@nestjs/common';
import { ResultNotification } from '../../validators/result-notification';
import { NotificationErrors } from '../../validators/checker-notification.errors';

export abstract class BaseNotificationHandler<TCommand, TResult> {
  private readonly logger = new Logger(BaseNotificationHandler.name);

  async execute(command: TCommand): Promise<ResultNotification<TResult>> {
    const notification = new ResultNotification<TResult>();
    try {
      const result = await this.executeHandler(command);
      if (result) notification.addData(result);
    } catch (e) {
      notification.addErrorFromNotificationException(e);
      this.logger.log('BaseNotificationHandler:', +JSON.stringify(command));
      this.logger.error(JSON.stringify(e));
    }

    if (notification.hasError()) throw new NotificationErrors(notification);

    return notification;
  }

  abstract executeHandler(command: TCommand): Promise<TResult>;
}
