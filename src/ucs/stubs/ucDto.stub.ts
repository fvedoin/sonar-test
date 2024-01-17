import { Types } from 'mongoose';
import { CreateUcDto } from '../dto/create-uc.dto';

export const ucDtoStubs = (dto?: Partial<CreateUcDto>): CreateUcDto => {
  return {
    clientId: '6401fdaf1224add8ade50026',
    transformerId: new Types.ObjectId('640667dd2d824a3ec7cde77f').toString(),
    deviceId: new Types.ObjectId('640667dd2d824a3ec7cde788').toString(),
    billingGroup: 0,
    routeCode: 11,
    ucCode: 'string',
    ucNumber: 'string',
    ucClass: 'string',
    group: 'string',
    subClass: 'string',
    subGroup: 'string',
    sequence: 'string',
    phases: 'A',
    circuitBreaker: 0,
    microgeneration: true,
    city: 'string',
    district: 'string',
    latitude: 0,
    longitude: 0,
    ratedVoltage: 220,
    ...dto,
  };
};
