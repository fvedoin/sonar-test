import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './entities/token.entity';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
