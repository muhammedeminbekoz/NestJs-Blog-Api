import { Injectable } from '@nestjs/common';
import { Users, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<Users[]> {
    return await this.prisma.users.findMany();
  }

  async getUserById(id: number): Promise<Users | null> {
    const result = await this.prisma.users.findUnique({
      where: { email: id.toString() },
    });
    console.log(result);
    return result;
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return await this.prisma.users.create({ data });
  }

  async findOne(email: string): Promise<Users | null> {
    const data = await this.prisma.users.findUnique({
      where: { email },
    });
    console.log('userservice: ', data);
    return data;
  }
}
