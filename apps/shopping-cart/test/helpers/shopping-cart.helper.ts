import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { shoppingCartEndpoints } from '@shopping-cart/modules/cart-item/api/routing/shopping-cart.routing';
import { UpdateCartDto } from '@shopping-cart/modules/cart-item/api/dtos/request/update-cart.dto';

export class ShoppingCartHelper {
  constructor(private readonly app: INestApplication) {}

  async getCart(
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    const response = await request(this.app.getHttpServer())
      .get(shoppingCartEndpoints.getCartItems())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);

    return response.body;
  }

  async addItemToCart(
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
      .post(shoppingCartEndpoints.add())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    return response.body;
  }

  async updateItemInCart(
    command: UpdateCartDto,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .put(shoppingCartEndpoints.update())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .send(command)
      .expect(expectedCode);
    return response.body;
  }

  async deleteItemFromCart(
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
      .delete(shoppingCartEndpoints.delete(command.productId))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);
    return response.body;
  }
}
