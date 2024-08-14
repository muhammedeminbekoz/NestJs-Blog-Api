import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Posts } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getPosts(): Promise<Posts[]> {
    const posts = await this.postsService.getPosts();
    if (!posts) {
      throw new HttpException('posts not found', HttpStatus.NOT_FOUND);
    }
    return posts;
  }

  @Get(':id')
  async getUserPosts(@Param('id') userId: string) {
    const posts = await this.postsService.getUserPosts(userId);
    if (!posts) {
      throw new HttpException('posts not found', HttpStatus.NOT_FOUND);
    }

    return posts;
  }

  @UseGuards(AuthGuard)
  @Post()
  createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const token = req.headers?.authorization?.split(' ')[1];
    const { userId } = this.jwtService.decode(token);
    return this.postsService.createPost(userId, createPostDto);
  }
}
