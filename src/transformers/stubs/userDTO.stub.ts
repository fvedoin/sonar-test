import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userDTOStub = (): CreateUserDto => {
  return {
    name: 'User teste',
    accessLevel: 'admin',
    clientId: new Types.ObjectId().toString(),
    modules: ['test'],
    password: '3333',
    username: 'transformersdevices@test.com.br',
  };
};
