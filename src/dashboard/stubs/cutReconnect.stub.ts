import { Types } from 'mongoose';

export const cutReconnectStub = (id?: Types.ObjectId) => ({
  _id: id,
  name: 'Fox-iot',
  type: 0,
  deviceId: '6351aed9f85a010f3cbf8d32',
  userId: '60953bf3921e3b0df01a6c99',
  status: 'Completo',
  tech: 'GSM',
});
