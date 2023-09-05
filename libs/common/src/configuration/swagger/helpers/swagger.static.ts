import { INestApplication } from '@nestjs/common';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

export const swaggerStatic = (app: INestApplication) => {
  const port = app.get(ApiConfigService).PORT;
  const dev = app.get(ApiConfigService).NODE_ENV;

  if (dev === 'development') {
    const serverUrl = `http://localhost:${port}`;
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    });
    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(`${serverUrl}/api/swagger-ui-standalone-preset.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
    });

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });
  }
  return;
};
