import { UserFromJwt } from 'src/auth/models/UserFromJwt';

export const userStub = (): UserFromJwt => {
  return {
    id: '5e8b4c4e4e0c3d3f8c8b4567',
    username: 'adminUc',
    name: 'adminUc',
    clientId: '5f8b4c4e4e0c3d3f8c8b4567',
    modules: [''],
    accessLevel: 'admin',
  };
};
