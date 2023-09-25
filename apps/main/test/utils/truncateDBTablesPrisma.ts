import { PrismaClient } from '@prisma/client';

export async function truncateDBTablesPrisma(prisma: PrismaClient): Promise<void> {
  try {
    const models = Object.keys(prisma).filter(item => {
      return !(item.startsWith('_') || item.endsWith('$extends') || item.startsWith('$'));
    });
    for (const model of models) {
      await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${model}" RESTART IDENTITY CASCADE;`);
    }
  } catch (e) {
    console.log('DELETED ERROR:', e);
  }
}
