import { Prisma } from '@prisma/client';

export class Users implements Prisma.UsersCreateInput {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
