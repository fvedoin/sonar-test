import { Types } from 'mongoose';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { User } from '../entities/user.entity';

export const userFromJtwStub = (): UserFromJwt => {
  return {
    id: '5f8b4c4e4e0c3d3f8c8b4567',
    username: 'users@test.com.br',
    name: 'User test',
    clientId: '5f8b4c4e4e0c3d3f8c8b4567',
    modules: ['test'],
    accessLevel: 'admin',
  };
};

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId(),
    username: 'users@test.com.br',
    name: 'User test',
    clientId: new Types.ObjectId(),
    modules: ['test'],
    accessLevel: 'admin',
    password: 'password',
    active: false,
    attempts: 0,
    blocked: false,
    createdAt: new Date(),
    image: '',
    codeExpiredAt: new Date(
      new Date().setMinutes(new Date().getMinutes() + 30),
    ),
    generatedCode: 1000,
  };
};
