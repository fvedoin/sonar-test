import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsRepository extends AbstractRepository<Client> {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectConnection() connection: Connection,
  ) {
    super(clientModel, connection);
  }
}
