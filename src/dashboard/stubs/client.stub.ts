import { Types } from 'mongoose';

export const clientStub = (id?: Types.ObjectId) => ({
  _id: id,
  name: 'Fox-iot',
});
