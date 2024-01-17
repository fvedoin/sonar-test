import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { makeToken } from 'src/utils/tokens';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async create(userId: string) {
    const token = await this.tokenRepository.findOneWhere({ userId });

    if (token) await token.deleteOne();

    const resetToken = makeToken(32);

    const hash = await bcrypt.hash(resetToken, 10);

    await this.tokenRepository.create({
      userId,
      token: hash,
      createdAt: new Date(),
    });

    return resetToken;
  }

  async compare(userId: string, token: string) {
    const passwordResetToken = await this.tokenRepository.findOneWhere({
      userId,
    });

    if (!passwordResetToken) {
      throw new Error('Invalid or expired password reset token.');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw new Error('Invalid or expired password reset token.');
    }

    return true;
  }

  async deleteByUserId(userId: string) {
    const passwordResetToken = await this.tokenRepository.findOneWhere({
      userId,
    });

    passwordResetToken.deleteOne();
  }
}
