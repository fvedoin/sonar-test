import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { TokenService } from 'src/token/token.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  //turn the user into a JWT
  async login(user: UserDocument): Promise<UserToken> {
    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      accessLevel: user.accessLevel,
      modules: user.modules,
      clientId: user.clientId.toString(),
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findCompleteByUsername(email);

    if (user) {
      //check if the password provided is the same as the hash in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user;
      }
    }

    throw new Error('Email address or password provided is incorrect.');
  }

  async requestPasswordReset(username: string) {
    if (!username) throw new Error('Email address provided is incorrect.');

    const user = await this.userService.findCompleteByUsername(username);

    if (!user) throw new Error('Email address provided is incorrect.');

    const token = await this.tokenService.create(user._id.toString());

    const link = `https://app.spinon.com.br/password-reset/${token}+${user._id}`;

    this.rabbitMQService.send('notification', {
      channels: {
        email: {
          title: 'Recuperação de senha',
          subject: 'Recuperação de senha',
          type: 'requestPasswordReset',
          receivers: [username],
          context: {
            link,
          },
        },
      },
    });

    return {};
  }

  async resetPassword({
    userId,
    password,
    token,
  }: {
    userId: string;
    password: string;
    token: string;
  }) {
    const isValidToken = await this.tokenService.compare(userId, token);

    if (!isValidToken) {
      throw new Error('Token is invalid.');
    }

    await this.tokenService.deleteByUserId(userId);

    await this.userService.updatePassword(userId, password);
  }
}
