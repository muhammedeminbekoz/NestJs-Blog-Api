import { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto implements Prisma.UsersCreateInput {
  firstname: string;
  @IsString()
  lastname: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
