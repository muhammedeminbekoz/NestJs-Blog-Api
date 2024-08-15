import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { jwtConstants } from '../utils/constants';
import { PostgresErrorCode } from 'src/enums/postgresErrorCodes.enum';

interface TokenPayload {
  userId: string;
}
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

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);
      await this.verifyPassword(password, user?.password);
      return this.getCookieWithJwtToken(user.id);
    } catch (err) {
      throw new HttpException(
        'Email or password wrong',
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

  getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return {
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expiresIn}`,
      token,
    };
  }

  getCookieForLogout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
