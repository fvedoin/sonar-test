import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userDTOStub = (): CreateUserDto => {
  return {
    name: 'User test',
    accessLevel: 'admin',
    clientId: new Types.ObjectId().toString(),
    modules: ['test'],
    password: '123456',
    username: 'meter-change@test.com.br',
  };
};
