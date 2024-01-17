import { Types } from 'mongoose';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '../entities/client.entity';

export const clientStubs = (clientDtoStubs: CreateClientDto): Client => {
  return {
    ...clientDtoStubs,
    _id: new Types.ObjectId('4edd41c86762e5fb12000003'),
  };
};
