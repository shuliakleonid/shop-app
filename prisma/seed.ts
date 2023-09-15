import { PrismaClient, RoleTitle } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

const roles = [
  { code: 1, name: RoleTitle.CUSTOMER, description: 'CUSTOMER role' },
  {
    code: 2,
    name: RoleTitle.ADMINISTRATOR,
    description: 'Administrator role',
  },
];

export async function createRandomUser() {
  const firstName = faker.person.firstName();
  const email = faker.internet.email();
  return {
    userName: firstName,
    roleId: 1,
    password: await argon.hash('pwned'),
    email: email,
  };
}

async function main() {
  const prisma = new PrismaClient();

  await prisma.$transaction([prisma.user.deleteMany(), prisma.role.deleteMany()]);

  for (const role of roles) {
    await prisma.role.create({
      data: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });
  }

  for (let i = 0; i <= 100; ++i) {
    const userData = await createRandomUser();
    await prisma.user.create({
      data: {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        roleId: i % 10 ? userData.roleId : 2,
      },
    });
  }
}

main();
