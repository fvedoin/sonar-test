import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';

import { CreateMqttAccessDto } from './dto/create-mqtt-access.dto';
import { UpdateMqttAccessDto } from './dto/update-mqtt-access.dto';
import { MqttAccess, MqttAccessDocument } from './entities/mqtt-access.entity';

@Injectable()
export class MqttAccessService {
  constructor(
    @InjectModel(MqttAccess.name)
    private mqttAccessModel: Model<MqttAccessDocument>,
  ) {}

  create(createMqttAccessDto: CreateMqttAccessDto, session?: ClientSession) {
    const createdMqttAccess = new this.mqttAccessModel(createMqttAccessDto);
    return createdMqttAccess.save({ session });
  }

  findAll() {
    return this.mqttAccessModel.find();
  }

  findOne(id: string) {
    return this.mqttAccessModel.findById(id);
  }

  findOneWhere(where: FilterQuery<MqttAccessDocument>) {
    return this.mqttAccessModel.findOne(where);
  }

  updateOneWhere(
    where: FilterQuery<MqttAccessDocument>,
    updateMqttAccessDto: UpdateMqttAccessDto,
    session?: ClientSession,
  ) {
    return this.mqttAccessModel.findOneAndUpdate(where, updateMqttAccessDto, {
      session,
    });
  }

  update(id: string, updateMqttAccessDto: UpdateMqttAccessDto) {
    return this.mqttAccessModel.findByIdAndUpdate(id, updateMqttAccessDto);
  }

  clearStatus() {
    return this.mqttAccessModel.updateMany({}, { $unset: { online: 1 } });
  }

  connect(devId: string) {
    return this.mqttAccessModel.updateMany({ devId: devId }, { online: true });
  }

  disconnect(devId: string) {
    return this.mqttAccessModel.updateMany({ devId: devId }, { online: false });
  }

  remove(id: string) {
    return this.mqttAccessModel.findByIdAndDelete(id);
  }
}
