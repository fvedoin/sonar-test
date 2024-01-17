import { Types } from 'mongoose';
import { CreateMeterChangeDto } from '../dto/create-meter-change.dto';
import { MeterChanges } from '../entities/meter-change.entity';

export const meterChangeStubs = (
  meterChangeDtoStubs: CreateMeterChangeDto,
): MeterChanges => {
  return {
    ...meterChangeDtoStubs,
    _id: new Types.ObjectId('62d6b07414cc0905a474298f'),
  };
};
