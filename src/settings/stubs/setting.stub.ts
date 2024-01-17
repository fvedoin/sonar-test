import { Types } from 'mongoose';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { Setting } from '../entities/setting.entity';

export const settingStubs = (createSettingDto: CreateSettingDto): Setting => {
  return {
    ...createSettingDto,
    _id: new Types.ObjectId(),
  };
};
