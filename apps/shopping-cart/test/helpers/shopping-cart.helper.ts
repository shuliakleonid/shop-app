import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { shoppingCartEndpoints } from '@shopping-cart/modules/cart-item/api/routing/shopping-cart.routing';
import { AddProductToCartCommand } from '@shopping-cart/modules/cart-item/application/use-cases/add-product-to-cart.use-case';

export class ShoppingCartHelper {
  constructor(private readonly app: INestApplication) {}

  async getCart(
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.OK;
    const response = await request(this.app.getHttpServer())
      .get(shoppingCartEndpoints.getCartItems())
      .expect(expectedCode);

    return response.body;
  }

  async addItemToCart(
    command: AddProductToCartCommand,
    config: {
      expectedBody?: any;
      expectedCode?: number;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .post(shoppingCartEndpoints.add())
      .send(command)
      .expect(expectedCode);
    return response.body;
  }
}
