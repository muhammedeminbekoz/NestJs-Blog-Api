import { Injectable } from '@nestjs/common';
import { Posts, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  getPosts(): Promise<Posts[]> {
    return this.prisma.posts.findMany();
  }

  getUserPosts(userId: string): Promise<Posts[]> {
    return this.prisma.posts.findMany({ take: 10, where: { userId } });
  }

  createPost(userId: string, post: any): Promise<Posts> {
    return this.prisma.posts.create({
      data: {
        ...post,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
