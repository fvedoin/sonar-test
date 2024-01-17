import { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';

export const clientStub = (_id: string, dto?: Partial<Client>): Client => {
  return {
    name: 'Cliente teste',
    _id: new Types.ObjectId(_id),
    address: 'Testing Address',
    cnpj: '00000000000',
    initials: 'TTT',
    local: '',
    modules: ['test'],
    ...dto,
  };
};
