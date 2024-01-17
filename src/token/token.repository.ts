import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    @InjectConnection() connection: Connection,
  ) {
    super(tokenModel, connection);
  }

  async findOneWhere(whereClause) {
    return await this.tokenModel.findOne(whereClause);
  }
}
