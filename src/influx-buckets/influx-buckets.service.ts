import { InfluxDB } from '@influxdata/influxdb-client';
import { BucketsAPI } from '@influxdata/influxdb-client-apis';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';

import { CreateInfluxBucketDto } from './dto/create-influx-bucket.dto';
import { UpdateInfluxBucketDto } from './dto/update-influx-bucket.dto';
import {
  InfluxBucket,
  InfluxBucketDocument,
} from './entities/influx-bucket.entity';

@Injectable()
export class InfluxBucketsService {
  constructor(
    @InjectModel(InfluxBucket.name)
    private influxBucketModel: Model<InfluxBucketDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly influxConnectionsService: InfluxConnectionsService,
  ) {}

  async create(createInfluxBucketDto: CreateInfluxBucketDto) {
    const influxConnection = await this.influxConnectionsService.findOne(
      createInfluxBucketDto.influxConnectionId,
    );

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    const influxBucket = new this.influxBucketModel(createInfluxBucketDto);
    await influxBucket.save({ session: transactionSession });

    const influxDB = new InfluxDB({
      url: influxConnection.host,
      token: influxConnection.apiToken,
    });

    const bucketsAPI = new BucketsAPI(influxDB);
    await bucketsAPI.postBuckets({
      body: {
        orgID: influxConnection.orgId,
        name: createInfluxBucketDto.name,
      },
    });

    await transactionSession.commitTransaction();
    transactionSession.endSession();

    return influxBucket;
  }

  findOne(
    id:
      | string
      | (Document<unknown, any, InfluxBucket> &
          InfluxBucket & { _id: Types.ObjectId }),
    populate?: string,
    projection?: FilterQuery<InfluxBucket>,
  ) {
    return this.influxBucketModel.findById(id, projection).populate(populate);
  }

  findOneWhere(where: FilterQuery<InfluxBucketDocument>) {
    return this.influxBucketModel.findOne(where);
  }

  findByInfluxConnection(id: string) {
    return this.influxBucketModel.find({ influxConnectionId: id });
  }

  update(id: string, updateInfluxBucketDto: UpdateInfluxBucketDto) {
    return this.influxBucketModel.findByIdAndUpdate(id, updateInfluxBucketDto);
  }

  remove(id: string) {
    return this.influxBucketModel.deleteOne({ _id: id }).exec();
  }
}
