import { UserFromJwt } from 'src/auth/models/UserFromJwt';

export const userStub = (): UserFromJwt => {
  return {
    id: '5f8b4c4e4e0c3d3f8c8b4569',
    username: 'admin',
    name: 'admin',
    clientId: '5f8b4c4e4e0c3d3f8c8b4567',
    modules: [''],
    accessLevel: 'admin',
  };
};
