import { AbstractRepository } from 'src/common/database/abstract.repository';
import { InfluxConnection } from './entities/influx-connection.entity';
import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InfluxConnectionRepository extends AbstractRepository<InfluxConnection> {
  constructor(
    @InjectModel(InfluxConnection.name)
    private influxConnectionModel: Model<InfluxConnection>,
    @InjectConnection() connection: Connection,
  ) {
    super(influxConnectionModel, connection);
  }

  async findById(id) {
    return this.influxConnectionModel.findById(id);
  }
}
