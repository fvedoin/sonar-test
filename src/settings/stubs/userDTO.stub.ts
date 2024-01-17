import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userDTOStub = (): CreateUserDto => {
  return {
    name: 'test settings',
    accessLevel: 'admin',
    clientId: new Types.ObjectId().toString(),
    modules: ['test'],
    password: '123456',
    username: 'test@setting.com.br',
  };
};
