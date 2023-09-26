import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { productRoutes } from '@catalog/modules/products/api/routing/productEndpoint';
import { CreateProductDto } from '@catalog/modules/products/api/dtos/request/create-product.dto';
import { UpdateProductDto } from '@catalog/modules/products/api/dtos/request/update-product.dto';

export class ProductHelper {
  constructor(private readonly app: INestApplication) {}

  async getAllProducts(
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .get(productRoutes.getAll())
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);

    return response.body;
  }

  async getProductById(
    command: number,
    config: {
      expectedBody?: any;
      expectedCode?: number;
      accessToken?: string;
      refreshToken?: string;
    } = {},
  ): Promise<any> {
    const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
    const response = await request(this.app.getHttpServer())
      .get(productRoutes.getById(command))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
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
    command: UpdateProductDto & { id: number },
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
      .send({ name: command.name, description: command.description, price: command.price, quantity: command.quantity })
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
      .delete(productRoutes.delete(command))
      .set('Authorization', `Bearer ${config.accessToken}`)
      .set('Cookie', `refreshToken=${config.refreshToken}`)
      .expect(expectedCode);
  }
}
