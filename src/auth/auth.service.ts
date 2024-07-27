import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findOne(email);
      await this.verifyPassword(password, user?.password);
      const payload = {
        sub: user.id,
        username: user.firstname + user.lastname,
      };
      return { access_token: await this.jwtService.sign(payload) };
    } catch (err) {
      throw new HttpException(
        'Email or password wrong salam',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isMatch) {
      throw new HttpException(
        'Email or password wrong sosis',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
