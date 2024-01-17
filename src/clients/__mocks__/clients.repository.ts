import { clientStubs } from '../stubs/client.stub';
import { clientDtoStubs } from '../stubs/clientDTO.stub';

export const ClientRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(clientStubs(clientDtoStubs())),
});
