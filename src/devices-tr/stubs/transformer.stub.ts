import { CreateTransformerDto } from 'src/transformers/dto/create-transformer.dto';
import { Types } from 'mongoose';

export const transformerStubs = (it): CreateTransformerDto => {
  return {
    clientId: new Types.ObjectId().toString(),
    secondaryDeviceId: new Types.ObjectId().toString(),
    it,
    latitude: -53.75593,
    longitude: -29.69786,
    serieNumber: 'sm-00',
    tap: 75,
    tapLevel: 1,
    feeder: '1',
    city: 'Santa Maria',
    loadLimit: 100,
    overloadTimeLimit: 0,
    nominalValue_i: 0,
    smartTrafoDeviceId: new Types.ObjectId().toString(),
  };
};
