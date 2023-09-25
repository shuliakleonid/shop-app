import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AssignNewRoleDto } from '@main/modules/user/api/dtos/request/assign-new-role.dto';

export class UserHelper {
  constructor(private readonly app: INestApplication) {}

  async assignNewRole(
    command: AssignNewRoleDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      refreshToken?: string;
      accessToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken} `)
      .send(command)
      .expect(expectedCode);
    const refreshToken = await this.checkRefreshTokenInCookieAndReturn(response);

    return { body: response.body, refreshToken: refreshToken };
  }

  async checkRefreshTokenInCookieAndReturn(response: request.Response): Promise<string> {
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    // expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    // expect(response.headers['set-cookie'][0]).toContain('Path=/');
    // expect(response.headers['set-cookie'][0]).toContain('Secure');

    return response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  }
}
