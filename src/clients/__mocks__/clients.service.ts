import { clientStubs } from '../stubs/client.stub';
import { clientDtoStubs } from '../stubs/clientDTO.stub';

export const ClientsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(clientStubs(clientDtoStubs())),
  findOne: jest.fn().mockResolvedValue(clientStubs(clientDtoStubs())),
  findWhere: jest.fn().mockResolvedValue(clientStubs(clientDtoStubs())),
  findAll: jest.fn().mockResolvedValue([clientStubs(clientDtoStubs())]),
  update: jest
    .fn()
    .mockResolvedValue(clientStubs(clientDtoStubs({ name: 'updated' }))),
  remove: jest.fn().mockResolvedValue(clientStubs(clientDtoStubs())),
});
