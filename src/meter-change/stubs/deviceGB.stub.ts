import { Types } from 'mongoose';

export const deviceGBStub = (id: string) => {
  return {
    _id: new Types.ObjectId(id),
    allows: [],
    clientId: new Types.ObjectId('60953b5f9925823178397e3f'),
    devId: 'ucd-768',
    bucketId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    name: 'UC 768 desativada',
    communication: '',
    type: '',
    description: '',
    applicationId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
  };
};
