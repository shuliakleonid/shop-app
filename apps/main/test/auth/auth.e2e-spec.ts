import { HttpStatus, INestApplication } from '@nestjs/common';
import { getAppForE2ETesting } from '../utils/tests.utils';
import { AuthHelper } from '../helpers/auth-helper';
import { ApiErrorResultDto } from '@common/validators/api-error-result.dto';

jest.setTimeout(120000);
describe('Authorisation -  e2e', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
    authHelper = new AuthHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  //auth/registration
  it('01 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { password: '12345678', email: 'Doe', userName: 'DoeName', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('02 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: 'qwert', email: 'fortesting@jive.com', userName: 'DoeName', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('03 - / (POST) - should return 400 if email and password is incorrect', async () => {
    const command = { password: 'qwert', email: 'Doe', userName: 'DoeName', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(2);
    expect(response.messages[1].field).toBe('password');
    expect(response.messages[0].field).toBe('email');
  });
  it('03_1 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: '', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('03_2 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: 'Doe', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('03_3 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = { password: 'qwerty', email: 'fortesting@jive.com', userName: 'D'.repeat(31), consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('03_4 - / (POST) - should return 400 if userName is incorrect', async () => {
    const command = {
      password: 'qwerty',
      email: 'fortesting@jive.com',
      userName: 'D name'.repeat(31),
      consentGiven: true,
    };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('userName');
  });
  it('04 - / (POST) - should return 400 if email is empty', async () => {
    const command = { password: '', email: 'fortesting@jive.com', userName: 'DoeName', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('05 - / (POST) - should return 400 if password is empty', async () => {
    const command = { password: '1234567', email: '', userName: 'DoeName', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('06 - / (POST) - should return 400 if email or userName not unique', async () => {
    const command = { password: '12345678', email: 'correct@eamil.co', userName: 'DoeName', consentGiven: true };
    await authHelper.registrationUser(command, { expectedCode: 204 });
    const response2: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response2.messages).toHaveLength(1);
    expect(response2.messages[0].field).toBe('userName');
    const command3 = { password: '12345678', email: 'correct@eamil.co', userName: 'CatName', consentGiven: true };
    const response3: ApiErrorResultDto = await authHelper.registrationUser(command3, { expectedCode: 400 });
    expect(response3.messages).toHaveLength(1);
    expect(response3.messages[0].field).toBe('email');
  });

  //auth/login
  it('7 - / (POST) - should return 400 if email is incorrect', async () => {
    const command = { password: '12345678', email: 'Doe' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });
  it('8 - / (POST) - should return 400 if password is incorrect', async () => {
    const command = { password: '', email: 'dafsfd@dsaff.te' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('password');
  });
  it('9 - / (POST) - should return 401 if user not unauthorized', async () => {
    const command = { password: '12345678', email: 'Doe@doede.he' };
    const response: ApiErrorResultDto = await authHelper.login(command, { expectedCode: 401 });
    expect(response.messages).toHaveLength(1);
    expect(response.error).toBe('Unauthorized');
  });

  //auth/logout
  it('10 - / (POST) - should return 401 if user not unauthorized', async () => {
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ90.' +
      'eyJ1c2VySWQiOjMwMiwiaWF0IjoxNjgwOTUzMDUzLCJleHAiOjE2ODEwMzk0NTN9.' +
      '9k9OHxm74NydJP9XFLHMAZcu06-_KvN5YRcw-ASYgvk';
    const response = await authHelper.logout({ expectedCode: 401, expectedBody: invalidToken });
    expect(response.error).toBe('Unauthorized');
  });
  //auth/refresh-token
  it('11 - / (POST) - should return 401 if user not unauthorized', async () => {
    const response: ApiErrorResultDto = await authHelper.refreshToken({ expectedCode: 401 });
    expect(response.messages).toHaveLength(1);
    expect(response.error).toBe('Unauthorized');
  });

  // Registration correct data
  let correctEmail: string;
  let correctPassword: string;
  let userName: string;
  it('12 - / (POST) - should return 204 if email and password is correct', async () => {
    correctEmail = 'test@test.ts';
    correctPassword = '12345678';
    userName = 'raccoon';
    const command = { password: correctPassword, email: correctEmail, userName };
    await authHelper.registrationUser(command, { expectedCode: 204 });
  });
  //Login correct data
  let refreshToken: string;
  let accessToken: string;
  it('12 - / (POST) - should return 200 if password and email correct', async () => {
    const command = { password: correctPassword, email: correctEmail };
    const response = await authHelper.login(command, { expectedCode: 200 });
    refreshToken = await authHelper.checkRefreshTokenInCookieAndReturn(response);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body).toEqual({ accessToken: expect.any(String) });
    accessToken = response.body.accessToken;
  });

  //Get myInfo
  it('12.1 - / (GET) - should return 200 and info about logged user', async () => {
    const myInfo = await authHelper.me(accessToken);
    expect(myInfo).toEqual({ userId: expect.any(Number), userName, email: correctEmail });
  });
  it('12.2 - / (GET) - should return 401 if user not authorized', async () => {
    await authHelper.me('bad accessToken', HttpStatus.UNAUTHORIZED);
  });

  //Logout correct data
  it('13 - / (POST) - should return 204 if user authorized', async () => {
    await authHelper.logout({ expectedCode: 204, expectedBody: refreshToken });
  });
  it('14 - / (POST) - should return 401 if user is already logout', async () => {
    const response: ApiErrorResultDto = await authHelper.logout({ expectedCode: 401, expectedBody: refreshToken });
    expect(response.error).toBe('Unauthorized');
  });

  //Login with incorrect email
  it('15 - / (POST) - should return 400 if email incorrect', async () => {
    const command = { password: 'newPassword', email: 'incorrectEmail' };
    const response = await authHelper.login(command, { expectedCode: 400 });
    expect(response.error).toBe('Bad Request');
  });
  //Registration incorrect data
  it('16 - / (POST) - should return 400 if email incorrect', async () => {
    const command = { password: correctPassword, email: 'incorrectEmail', userName: 'raccoon', consentGiven: true };
    const response: ApiErrorResultDto = await authHelper.registrationUser(command, { expectedCode: 400 });
    expect(response.messages).toHaveLength(1);
    expect(response.messages[0].field).toBe('email');
  });

  //Update refresh token
  // it('43 - / (POST) - should return 200 if refreshToken correct', async () => {
  //   const response = await authHelper.refreshToken({ expectedCode: 200, expectedBody: freshRefreshToken });
  //   expect(response.body.accessToken).toBeDefined();
  //   await authHelper.checkRefreshTokenInCookieAndReturn(response);
  // });
  it.skip('18 - / (POST) - should return 401 if refreshToken expired', async () => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(10000);
    const response = await authHelper.refreshToken({ expectedCode: 401, expectedBody: refreshToken });
    expect(response.error).toBe('Unauthorized');
  });
});
