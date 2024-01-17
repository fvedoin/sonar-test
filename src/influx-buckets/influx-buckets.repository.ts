import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { InfluxBucket } from './entities/influx-bucket.entity';
import { Connection, Model } from 'mongoose';

@Injectable()
export class InfluxBucketRepository extends AbstractRepository<InfluxBucket> {
  constructor(
    @InjectModel(InfluxBucket.name)
    private influxBucketModel: Model<InfluxBucket>,
    @InjectConnection() connection: Connection,
  ) {
    super(influxBucketModel, connection);
  }

  async findBucketById(id) {
    return this.influxBucketModel.findById(id);
  }
}
