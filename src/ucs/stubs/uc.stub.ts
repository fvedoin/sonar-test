import { Types } from 'mongoose';
import { CreateUcDto } from '../dto/create-uc.dto';
import { Uc } from '../entities/uc.entity';

export const ucStubs = (
  ucDtoStubs: CreateUcDto,
  id = '63e53e35be706a6dabdd4837',
): Uc => {
  return {
    ...ucDtoStubs,
    location: {
      type: 'Point',
      coordinates: [ucDtoStubs.longitude, ucDtoStubs.latitude],
    },
    isCutted: false,
    timeZone: 'America/Sao_Paulo',
    _id: new Types.ObjectId(id),
  };
};
