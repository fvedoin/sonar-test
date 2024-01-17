import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { removeTrailingSlash } from 'src/common/utils/removeTrailingSlash';

import { CreateInfluxConnectionDto } from './dto/create-influx-connection.dto';
import { UpdateInfluxConnectionDto } from './dto/update-influx-connection.dto';
import {
  InfluxConnection,
  InfluxConnectionDocument,
} from './entities/influx-connection.entity';

@Injectable()
export class InfluxConnectionsService {
  constructor(
    @InjectModel(InfluxConnection.name)
    private influxConnectionModel: Model<InfluxConnectionDocument>,
  ) {}

  create(createInfluxConnectionDto: CreateInfluxConnectionDto) {
    const influxConnection = new this.influxConnectionModel({
      ...createInfluxConnectionDto,
      host: removeTrailingSlash(createInfluxConnectionDto.host),
    });
    return influxConnection.save();
  }

  findAll() {
    return this.influxConnectionModel.find();
  }

  findOne(
    id:
      | string
      | (Document<unknown, any, InfluxConnection> &
          InfluxConnection & { _id: Types.ObjectId }),
  ) {
    return this.influxConnectionModel.findById(id);
  }

  update(id: string, updateInfluxConnectionDto: UpdateInfluxConnectionDto) {
    if (updateInfluxConnectionDto.host) {
      const influxConnection = new this.influxConnectionModel({
        ...updateInfluxConnectionDto,
        host: removeTrailingSlash(updateInfluxConnectionDto.host),
      });
      return this.influxConnectionModel.findByIdAndUpdate(id, influxConnection);
    }

    return this.influxConnectionModel.findByIdAndUpdate(
      id,
      updateInfluxConnectionDto,
    );
  }

  remove(id: string) {
    return this.influxConnectionModel.deleteOne({ _id: id }).exec();
  }
}
