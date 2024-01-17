import { CreateTransformerDto } from 'src/transformers/dto/create-transformer.dto';
import { Types } from 'mongoose';
import { Transformer } from 'src/transformers/entities/transformer.entity';

export const transformersDtoStubs = (
  it: CreateTransformerDto['it'],
  dto?: Partial<CreateTransformerDto>,
): Transformer => {
  return {
    _id: new Types.ObjectId(),
    location: {
      type: 'Point',
      coordinates: [-52.02435390752231, -28.077725367731027],
    },
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
    ...dto,
  };
};
