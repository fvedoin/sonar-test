import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userStub = (): CreateUserDto => {
  return {
    password: 'password',
    username: 'test@test.com',
    name: 'test',
    clientId: '5f8b4c4e4e0c3d3f8c8b4567',
    modules: [''],
    accessLevel: 'admin',
  };
};
