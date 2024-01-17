import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  Application,
  ApplicationDocument,
} from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  create(
    createApplicationDto: CreateApplicationDto,
    token: string,
    session: ClientSession,
  ) {
    const application = new this.applicationModel({
      ...createApplicationDto,
      token,
    });
    return application.save({ session });
  }

  async findAll() {
    return this.applicationModel.find();
  }

  findOne(id: string) {
    return this.applicationModel.findById(id);
  }

  async findWhere(where: FilterQuery<ApplicationDocument>) {
    return this.applicationModel.find(where);
  }

  async findOneWhere(where: FilterQuery<ApplicationDocument>) {
    return this.applicationModel.findOne(where);
  }

  update(
    appId: string,
    updateApplicationDto: UpdateApplicationDto,
    session: ClientSession,
  ) {
    return this.applicationModel.findOneAndUpdate(
      { appId },
      updateApplicationDto,
      { session },
    );
  }

  remove(appId: string) {
    return this.applicationModel.deleteOne({ appId }).exec();
  }
}
