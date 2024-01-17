import { Types } from 'mongoose';
import { makeToken } from 'src/utils/tokens';

export const tokenStub = (userId?: string) => {
  return {
    userId: userId || Types.ObjectId.toString(),
    token: makeToken(32),
    createdAt: new Date(),
  };
};
