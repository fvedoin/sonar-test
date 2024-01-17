import { AbstractRepository } from 'src/common/database/abstract.repository';
import { User } from './entities/user.entity';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async findById(userId: string) {
    return await this.userModel.findById(userId);
  }

  async findByIdAndUpdate(userId: string, data) {
    return await this.userModel.findByIdAndUpdate(userId, data);
  }
}
