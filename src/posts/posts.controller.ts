import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Posts } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getPostsPage(@Query() { offset, limit }: PaginationDto) {
    return this.postsService.getPosts(offset, limit);
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
