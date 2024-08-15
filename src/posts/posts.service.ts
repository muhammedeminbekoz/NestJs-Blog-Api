import { Injectable } from '@nestjs/common';
import { Posts } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(limit?: number, offset?: number) {
    return await this.prisma.posts.findMany({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE,
    });
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
