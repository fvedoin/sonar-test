import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userDTOStub = (): CreateUserDto => {
  const id = new Types.ObjectId().toString();
  return {
    name: 'test devices-gb',
    accessLevel: 'admin',
    clientId: id,
    modules: ['test'],
    password: '123456',
    username: `test@device-ga.com.br`,
  };
};
