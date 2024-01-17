import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateApiAccessControlDto } from './dto/create-api-access-control.dto';
import { UpdateApiAccessControlDto } from './dto/update-api-access-control.dto';
import {
  ApiAccessControl,
  ApiAccessControlDocument,
} from './entities/api-access-control.entity';

@Injectable()
export class ApiAccessControlService {
  constructor(
    @InjectModel(ApiAccessControl.name)
    private apiAccessControlModel: Model<ApiAccessControlDocument>,
  ) {}
  create(createApiAccessControlDto: CreateApiAccessControlDto) {
    const ApiAccess = new this.apiAccessControlModel(createApiAccessControlDto);
    return ApiAccess.save();
  }

  findAll() {
    return this.apiAccessControlModel.find();
  }

  findOne(id: string) {
    return this.apiAccessControlModel.findById(id);
  }

  update(id: string, updateApiAccessControlDto: UpdateApiAccessControlDto) {
    return this.apiAccessControlModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        updateApiAccessControlDto,
      },
    );
  }

  remove(id: string) {
    return this.apiAccessControlModel.deleteOne({ _id: id }).exec();
  }
}
