import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createUserDto: AuthUserDto, @Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @IsPublic()
  @Post('forgot-password')
  async createResetPasswordToken(@Body() { username }: { username: string }) {
    try {
      return await this.authService.requestPasswordReset(username);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Erro ao enviar link.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @IsPublic()
  @Post('password-reset')
  async resetPassword(
    @Body()
    {
      userId,
      password,
      token,
    }: {
      userId: string;
      password: string;
      token: string;
    },
  ) {
    try {
      return await this.authService.resetPassword({
        userId,
        password,
        token,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Erro ao trocar senha.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
