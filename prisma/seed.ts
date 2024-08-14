import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export function seedMockUserData() {
  Array.from({ length: 100 }).map(async () => {
    await prisma.users.create({
      data: {
        firstname: faker.company.name(),
        lastname: faker.company.name(),
        email: faker.internet.email(),
        password: await bcrypt.hash('Asdqwe123;', 10),
      },
    });
  });
}

export async function seedMockPostRelationData() {
  const users = await prisma.users.findMany();

  if (users.length === 0) {
    throw new Error(
      'Kullanıcı yok, lütfen önce kullanıcı verilerini oluşturun.',
    );
  }
  console.log(users);
  await Promise.all(
    Array.from({ length: 5000 }).map(async () => {
      // Rastgele bir kullanıcı seç
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await prisma.posts.create({
        data: {
          content: faker.lorem.paragraph({ min: 2, max: 50 }),
          title: faker.lorem.sentence({ min: 1, max: 7 }),
          userId: randomUser.id,
        },
      });
    }),
  );
}
