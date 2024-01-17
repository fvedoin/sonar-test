import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaRepository extends AbstractRepository<Area> {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectConnection() connection: Connection,
  ) {
    super(areaModel, connection);
  }

  async findAllAndPopulate(populate: string[]) {
    return await this.areaModel.find().populate(populate);
  }

  async findAndPopulate(where, populate: string[]) {
    return await this.areaModel.find(where).populate(populate);
  }

  async deleteMany(options: FilterQuery<Area>) {
    await this.areaModel.deleteMany(options);
  }
}
