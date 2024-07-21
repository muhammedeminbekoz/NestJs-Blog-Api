import { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UsersModel implements Prisma.UsersCreateInput {
  id: number;
  firstname: string;
  @IsString()
  lastname: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
