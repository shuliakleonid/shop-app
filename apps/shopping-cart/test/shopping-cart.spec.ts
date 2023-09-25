import { getAppForE2ETesting } from '../../main/test/utils/tests.utils';
import { AuthHelper } from '../../main/test/helpers/auth-helper';
import { INestApplication } from '@nestjs/common';

jest.setTimeout(120000);

describe('Testing flow shopping cart  -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const correctEmail_first_user = 'Nindzi77@yahoo.om';
  const correctUserName_first_user = 'Botsford';
  const correctEmail_second_user = 'Serenity_Fahey@hotmail.com';
  const correctUserName_second_user = 'Pauline';

  let accessToken: string;
  let accessToken2: string;

  // Registration and login 2 users
  it('01 - / (POST) - should create user and returned accessToken', async () => {
    const command = { password: '12345678', email: correctEmail_first_user, userName: correctUserName_first_user };
    const command2 = { password: '12345678', email: correctEmail_second_user, userName: correctUserName_second_user };
    accessToken = await authHelper.createUser(command, { expectedCode: 204 });
    accessToken2 = await authHelper.createUser(command2, { expectedCode: 204 });
  });

  it('02 - / (Post)  - should create products ', async () => {});
});
