import { Types } from 'mongoose';
import { Client } from '../entities/client.entity';

export const clientPopulateStub = (): Client => {
  return {
    _id: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    name: 'Client 1',
    initials: 'CL1',
    cnpj: '12345678901234',
    aneelcode: '',
    local: '',
    address: '',
    active: true,
    modules: [''],
    parentId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
  };
};
