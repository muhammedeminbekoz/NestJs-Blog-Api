import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { cookie, token } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true, token });
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    res.status(200).json({ success: true, message: 'successfully logged out' });
  }

  @Post('register')
  register(@Body() registrationDto: RegisterDto) {
    return this.authService.register(registrationDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
