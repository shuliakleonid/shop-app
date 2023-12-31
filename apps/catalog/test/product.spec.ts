import { getAppForE2ETesting } from '../../main/test/utils/tests.utils';
import { AuthHelper } from '../../main/test/helpers/auth-helper';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ProductHelper } from './helper/product.helper';
import { RoleHelper } from '../../main/test/helpers/role-helper';
import { RoleTitle } from '@prisma/client';
import { CreateProductDto } from '@catalog/modules/products/api/dtos/request/create-product.dto';
import { AppModule as AppModuleMain } from '@main/app.module';
import { AppModule as AppModuleCatalog } from '@catalog/app.module';
import { CreateRoleDto } from '@main/modules/user/api/dtos/request/create-role.dto';
import { UpdateProductDto } from '@catalog/modules/products/api/dtos/request/update-product.dto';
import { faker } from '@faker-js/faker';
import { AssignNewRoleDto } from '@main/modules/user/api/dtos/request/assign-new-role.dto';
import { UserHelper } from '../../main/test/helpers/user-helper';

jest.setTimeout(120000);

describe('Testing product flow   -  e2e', () => {
  let appMain: INestApplication;
  let appCatalog: INestApplication;
  let authHelper: AuthHelper;
  let productHelper: ProductHelper;
  let roleHelper: RoleHelper;
  let userHelper: UserHelper;

  beforeAll(async () => {
    appMain = await getAppForE2ETesting(null, null, AppModuleMain);
    appCatalog = await getAppForE2ETesting(null, null, AppModuleCatalog);
    authHelper = new AuthHelper(appMain);
    productHelper = new ProductHelper(appCatalog);
    roleHelper = new RoleHelper(appMain);
    userHelper = new UserHelper(appMain);
  });

  afterAll(async () => {
    await appMain.close();
    await appCatalog.close();
  });

  const correctEmail_first_user = 'Nindzi77@yahoo.om';
  const correctUserName_first_user = 'Botsford';
  const correctEmail_second_user = 'Serenity_Fahey@hotmail.com';
  const correctUserName_second_user = 'Pauline';

  let accessToken: string;
  let accessToken2: string;
  let refreshToken: string;
  let refreshToken2: string;

  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    const command2 = { password: '12345678', email: correctEmail_second_user, userName: correctUserName_second_user };
    const tokens = await authHelper.createUser(command, { expectedCode: 204 });
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
    const tokens2 = await authHelper.createUser(command2, { expectedCode: 204 });
    accessToken2 = tokens2.accessToken;
    refreshToken2 = tokens2.refreshToken;
  });

  it('02 - / (POST)  - should CREATE admin role ', async () => {
    const command: CreateRoleDto = {
      name: RoleTitle.ADMINISTRATOR,
      description: 'Admin role description',
    };
    await roleHelper.createNewRole(command, { expectedCode: HttpStatus.CREATED, accessToken, refreshToken });
  });

  it('03 - / (POST) - should return 403 when customer try create product', async () => {
    const command: CreateProductDto = {
      name: 'test product',
      description: 'test description',
      price: 100,
      categoryId: 1,
    };
    await productHelper.createProduct(command, { expectedCode: HttpStatus.FORBIDDEN, accessToken, refreshToken });
  });

  it('04 - / (POST) - should return 403 when customer try update product', async () => {
    const command: UpdateProductDto & { id: number } = {
      name: 'test product',
      description: 'test description',
      price: 100,
      quantity: 10,
      id: 1,
    };
    await productHelper.updateProduct(command, { expectedCode: HttpStatus.FORBIDDEN, accessToken, refreshToken });
  });

  it('05 - / (POST) - should return 403 when customer try delete product', async () => {
    const command: { id: number } = { id: 1 };
    await productHelper.deleteProduct(command, { expectedCode: HttpStatus.FORBIDDEN, accessToken, refreshToken });
  });

  it('06 - / (POST) - should Assign role Admin to second user', async () => {
    const command: AssignNewRoleDto = {
      roleName: RoleTitle.ADMINISTRATOR,
      userId: 2,
    };
    const { refreshToken } = await userHelper.assignNewRole(command, {
      expectedCode: HttpStatus.CREATED,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });

    refreshToken2 = refreshToken;
  });

  it('07 - / (POST) - should create 10 PRODUCTS by ADMIN', async () => {
    await authHelper.login({ password: '12345678', email: correctEmail_second_user }, { expectedCode: 200 });
    for (let i = 0; i < 10; i++) {
      const createProductDto: CreateProductDto = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 10, max: 1000 }),
        categoryId: 1,
      };
      await productHelper.createProduct(createProductDto, {
        expectedCode: HttpStatus.CREATED,
        accessToken: accessToken2,
        refreshToken: refreshToken2,
      });
    }
  });

  it('08 - / (GET) - should return a list of products by ADMINISTRATOR', async () => {
    const products = await productHelper.getAllProducts({
      expectedCode: HttpStatus.OK,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('09 - / (GET) - should return a list of products by CUSTOMER', async () => {
    const products = await productHelper.getAllProducts({
      expectedCode: HttpStatus.OK,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('10 - / (GET) - should return a specific product by ID by ADMINISTRATOR', async () => {
    const productId = 1;
    const products = await productHelper.getProductById(productId, {
      expectedCode: HttpStatus.OK,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });
    expect(products).toBeDefined();
  });

  it('11 - / (GET) - should return a specific product by ID by CUSTOMER', async () => {
    const productId = 1;
    const product = await productHelper.getProductById(productId, {
      expectedCode: HttpStatus.OK,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });
    expect(product).toBeDefined();
  });

  it('12 - / (PUT) - should update a product by ID', async () => {
    const productId = 1;
    const updatedProductDto = {
      id: productId,
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      price: 200,
      quantity: 20,
    };
    await productHelper.updateProduct(updatedProductDto, {
      expectedCode: HttpStatus.OK,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });
  });

  it('13 - / (PUT) - should return 403 when customer try update a product by ID by CUSTOMER', async () => {
    const productId = 1;
    const updatedProductDto = {
      id: productId,
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      price: 200,
      quantity: 20,
    };
    await productHelper.updateProduct(updatedProductDto, {
      expectedCode: HttpStatus.FORBIDDEN,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  });

  it('14 - / (DELETE) - should delete a product by ID by ADMINISTRATOR', async () => {
    const productId = 1;
    await productHelper.deleteProduct(productId, {
      expectedCode: HttpStatus.OK,
      accessToken: accessToken2,
      refreshToken: refreshToken2,
    });
  });

  it('15 - / (DELETE) - should return 403 when customer try delete a product by ID by CUSTOMER', async () => {
    const productId = 2;
    await productHelper.deleteProduct(productId, {
      expectedCode: HttpStatus.FORBIDDEN,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  });
});
