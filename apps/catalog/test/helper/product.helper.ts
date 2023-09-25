import { HttpStatus, INestApplication } from '@nestjs/common';
import { RegisterInputDto } from '@main/modules/auth/api/dtos/request/register.dto';
import request from 'supertest';
import { authEndpoints } from '@main/modules/auth/api/routing/auth.routing';
import { MeViewDto } from '@main/modules/auth/api/dtos/response/me.dto';
import { productRoutes } from '@catalog/modules/products/api/routing/productEndpoint';
import { CreateProductDto } from '@catalog/modules/products/api/dtos/request/create-product.dto';

export class ProductHelper {
  constructor(private readonly app: INestApplication) {}

  async getCart(
    command: RegisterInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.registration())
      .send(command)
      .expect(expectedCode);

    return response.body;
  }

  async createProduct(
    command: CreateProductDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;
    const response = await request(this.app.getHttpServer())
      .post(productRoutes.create())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    if (expectedCode === HttpStatus.CREATED) {
      return response;
    }
    return response.body;
  }

  async updateProduct(
    command,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .put(productRoutes.update(command.id))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken} `)
      .expect(expectedCode);

    return response.body;
  }

  async deleteProduct(
    command,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    await request(this.app.getHttpServer())
      .delete(productRoutes.delete(command.id))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);
  }

  // async createUser(
  //   command: RegisterInputDto,
  //   config: {
  //     expectedBody?: any;
  //     expectedCode?: number;
  //   } = {},
  //   addCookie = false,
  // ): Promise<any> {
  //   await this.registrationUser(command, { expectedCode: 204 });
  //   let refreshToken: string;
  //   const command3 = { password: command.password, email: command.email };
  //   const response = await this.login(command3, { expectedCode: 200 });
  //   // eslint-disable-next-line prefer-const
  //   refreshToken = await this.checkRefreshTokenInCookieAndReturn(response);
  //
  //   expect(response.body.accessToken).toBeDefined();
  //   if (addCookie) {
  //     return { accessToken: response.body.accessToken, refreshToken: refreshToken };
  //   }
  //
  //   return response.body.accessToken;
  // }

  async me(accessToken: string, statusCode: HttpStatus = HttpStatus.OK): Promise<MeViewDto> {
    const response = await request(this.app.getHttpServer())
      .get(authEndpoints.me())
      .auth(accessToken, { type: 'bearer' })
      .expect(statusCode);

    return response.body;
  }

  //return refreshToken after check it
  async checkRefreshTokenInCookieAndReturn(response: request.Response): Promise<string> {
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Path=/');
    expect(response.headers['set-cookie'][0]).toContain('Secure');

    return response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  }
}
