import { getAppForE2ETesting } from '../../main/test/utils/tests.utils';
import { AuthHelper } from '../../main/test/helpers/auth-helper';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule as AppModuleMain } from '@main/app.module';
import { AppModule as AppModuleCatalog } from '@catalog/app.module';
import { AppModule as AppModuleShoppingCart } from '@shopping-cart/app.module';
import { AppModule as AppModuleOrders } from '@orders/app.module';
import { ProductHelper } from '../../catalog/test/helper/product.helper';
import { RoleHelper } from '../../main/test/helpers/role-helper';
import { UserHelper } from '../../main/test/helpers/user-helper';
import { CreateRoleDto } from '@main/modules/user/api/dtos/request/create-role.dto';
import { RoleTitle } from '@prisma/client';
import { CreateProductDto } from '@catalog/modules/products/api/dtos/request/create-product.dto';
import { UpdateProductDto } from '@catalog/modules/products/api/dtos/request/update-product.dto';
import { AssignNewRoleDto } from '@main/modules/user/api/dtos/request/assign-new-role.dto';
import { faker } from '@faker-js/faker';
import { AddProductToCartDto } from '@shopping-cart/modules/cart-item/api/dtos/request/add-product-to-cart.dto';
import { ShoppingCartHelper } from '../../shopping-cart/test/helpers/shopping-cart.helper';
import { OrdersHelper } from './helpers/orders.helper';

jest.setTimeout(120000);

describe('Testing flow shopping cart  -  e2e', () => {
  let appMain: INestApplication;
  let appCatalog: INestApplication;
  let appShoppingCart: INestApplication;
  let appOrder: INestApplication;
  let authHelper: AuthHelper;
  let productHelper: ProductHelper;
  let roleHelper: RoleHelper;
  let userHelper: UserHelper;
  let shoppingCartHelper: ShoppingCartHelper;
  let orderHelper: OrdersHelper;

  beforeAll(async () => {
    appMain = await getAppForE2ETesting(null, null, AppModuleMain);
    appCatalog = await getAppForE2ETesting(null, null, AppModuleCatalog);
    appShoppingCart = await getAppForE2ETesting(null, null, AppModuleShoppingCart);
    appOrder = await getAppForE2ETesting(null, null, AppModuleOrders);

    shoppingCartHelper = new ShoppingCartHelper(appShoppingCart);
    authHelper = new AuthHelper(appMain);
    productHelper = new ProductHelper(appCatalog);
    roleHelper = new RoleHelper(appMain);
    userHelper = new UserHelper(appMain);
    orderHelper = new OrdersHelper(appOrder);
  });

  afterAll(async () => {
    await appMain.close();
    await appCatalog.close();
    await appShoppingCart.close();
    await appOrder.close();
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

  it('08 - / (POST) - should customer add product to cart', async () => {
    const command: AddProductToCartDto = {
      productId: 1,
      quantity: 1,
    };
    await shoppingCartHelper.addItemToCart(command, { expectedCode: HttpStatus.CREATED, accessToken, refreshToken });
  });

  it('12 - / (GET) - should customer Get 1 product from cart', async () => {
    const productsInCart = await shoppingCartHelper.getCart({
      expectedCode: HttpStatus.OK,
      accessToken,
      refreshToken,
    });

    expect(productsInCart.cartItems.length).toBe(1);
  });

  it('13 - / (POST) - should customer create order', async () => {
    const command = [{ productId: 1 }, { productId: 2 }];
    await orderHelper.createOrder(command, { expectedCode: HttpStatus.CREATED, accessToken, refreshToken });
  });

  it('14 - / (POST) - should customer update order ', async () => {
    const command = [{ productId: 1 }, { productId: 2 }];
    await orderHelper.updateOrder(command, { expectedCode: HttpStatus.CREATED, accessToken, refreshToken });
  });
});
