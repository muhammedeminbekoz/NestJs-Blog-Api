import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export function seedMockData() {
  Array.from({ length: 10 }).map(async () => {
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

/*
 */

seedMockData();
