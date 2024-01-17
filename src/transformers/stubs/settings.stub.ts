import { Types } from 'mongoose';
import { Setting } from 'src/settings/entities/setting.entity';

type SettingStub = {
  _id: string;
  clientId: string;
};

export const settingsStub = ({ _id, clientId }): Setting => {
  return {
    _id: new Types.ObjectId(_id),
    clientId: new Types.ObjectId(clientId),
    criticalVoltageAbove: '',
    criticalVoltageBelow: '',
    offlineTime: 0,
    peakHourEnd: 20,
    peakHourStart: 60,
    precariousVoltageAbove: '',
    precariousVoltageBelow: '',
  };
};
