import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { rolesEndpoints } from '@main/modules/user/api/routing/role.endpoints';
import { CreateRoleDto } from '@main/modules/user/api/dtos/request/create-role.dto';

export class RoleHelper {
  constructor(private readonly app: INestApplication) {}

  async createNewRole(
    command: CreateRoleDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post(rolesEndpoints.createNewRole())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);

    return response.body;
  }
}
