import { INestApplication, HttpStatus } from '@nestjs/common';
import { RegisterInputDto } from '@main/modules/auth/api/dtos/request/register.dto';
import request from 'supertest';
import { LoginInputDto } from '@main/modules/auth/api/dtos/request/login.dto';
import { authEndpoints } from '@main/modules/auth/api/routing/auth.routing';
import { MeViewDto } from '@main/modules/auth/api/dtos/response/me.dto';

export class AuthHelper {
  constructor(private readonly app: INestApplication) {}

  async registrationUser(
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

  async login(
    command: LoginInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
    typeDevice = `for test`,
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.login())
      .set(`User-Agent`, typeDevice)
      .send(command)
      .expect(expectedCode);
    if (expectedCode === HttpStatus.OK) {
      return response;
    }
    return response.body;
  }

  async logout(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.logout())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    return response.body;
  }

  async refreshToken(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    // default expected code is 200 or code mistake from config
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    // send request for send email
    const response = await request(this.app.getHttpServer())
      .post(authEndpoints.updateTokens())
      .set('Cookie', `refreshToken=${config.expectedBody}`)
      .expect(expectedCode);

    if (expectedCode === HttpStatus.OK) {
      return response;
    }
    return response.body;
  }

  async createUser(
    command: RegisterInputDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
    addCookie = false,
  ): Promise<any> {
    await this.registrationUser(command, { expectedCode: 204 });
    let refreshToken: string;
    const command3 = { password: command.password, email: command.email };
    const response = await this.login(command3, { expectedCode: 200 });
    // eslint-disable-next-line prefer-const
    refreshToken = await this.checkRefreshTokenInCookieAndReturn(response);

    expect(response.body.accessToken).toBeDefined();
    if (addCookie) {
      return { accessToken: response.body.accessToken, refreshToken: refreshToken };
    }

    return response.body.accessToken;
  }

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
