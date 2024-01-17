import { Types } from 'mongoose';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

export const currentUserStub = (): UserFromJwt => {
  return {
    id: new Types.ObjectId().toString(),
    username: 'admin@admin.com.br',
    name: 'admin',
    clientId: new Types.ObjectId().toString(),
    modules: ['qualityGB'],
    accessLevel: Role.SUPER_ADMIN,
  };
};
