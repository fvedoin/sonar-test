import { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';

export const clientStub = (_id): Client => {
  return {
    name: 'User teste',
    _id: new Types.ObjectId(_id),
    address: 'Testing Address',
    cnpj: '00000000000',
    initials: 'TTT',
    local: '',
    modules: ['test'],
  };
};
