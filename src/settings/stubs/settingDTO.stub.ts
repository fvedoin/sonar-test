import { Types } from 'mongoose';
import { CreateSettingDto } from '../dto/create-setting.dto';

export const settingDtoStubs = (
  dto?: Partial<CreateSettingDto>,
): CreateSettingDto => {
  return {
    clientId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    offlineTime: 65106156,
    peakHourStart: 21,
    peakHourEnd: 0,
    precariousVoltageAbove: '233,250',
    precariousVoltageBelow: '231,233',
    criticalVoltageAbove: '231,233',
    criticalVoltageBelow: '191,202',
    ...dto,
  };
};
