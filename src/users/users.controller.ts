import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './model/users.model';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() data: UsersModel) {
    data.password = bcrypt.hashSync(data.password, 10);
    return this.usersService.createUser(data);
  }
}
