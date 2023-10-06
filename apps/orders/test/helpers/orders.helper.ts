import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { ordersEndpoints } from '@orders/modules/orders/api/routing/orders.routing';
import { CreateOrderDto } from '@orders/modules/orders/api/dtos/request/create-order.dto';

export class OrdersHelper {
  constructor(private readonly app: INestApplication) {}

  async getOrders(
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    const response = await request(this.app.getHttpServer())
      .get(ordersEndpoints.getAll())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);

    return response.body;
  }

  async getOrder(
    command,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .get(ordersEndpoints.get(command))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    return response.body;
  }

  async createOrder(
    command: CreateOrderDto[],
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post(ordersEndpoints.add())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    return response.body;
  }

  async updateOrder(
    command,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .put(ordersEndpoints.update('id'))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    return response.body;
  }

  async deleteOrder(
    command,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .delete(ordersEndpoints.delete(command))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);
    return response.body;
  }
}
