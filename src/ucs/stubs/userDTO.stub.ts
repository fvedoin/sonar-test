import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const userDTOStub = (dto?: Partial<CreateUserDto>): CreateUserDto => {
  return {
    name: 'User test',
    accessLevel: 'admin',
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026').toString(),
    modules: [
      'qualityGB',
      'exportGB',
      'alertsGB',
      'cutReconnectGB',
      'faultsGB',
      'qualityTR',
      'exportTR',
      'alertsTR',
    ],
    password: '123456',
    username: 'ucs@test.com.br',
    ...dto,
  };
};
