import { gatewayResponseStubFromTtn } from '../stubs/gateway.stub';
import { findFilteredGatewaysResponseStub } from '../stubs/gatewayFilteredClient.stub';
import { findOneResponseStub } from '../stubs/gatewayFindOne.stub';

export const GatewaysRepository = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([gatewayResponseStubFromTtn]),
  findOne: jest.fn().mockResolvedValue(findOneResponseStub),
  find: jest.fn().mockResolvedValue([findOneResponseStub]),
  filterByClients: jest
    .fn()
    .mockResolvedValue(findFilteredGatewaysResponseStub),
  findOneAndUpdateWithArgs: jest.fn().mockResolvedValue(findOneResponseStub),
  findOneWhere: jest.fn().mockResolvedValue(findOneResponseStub),
  findOneAndPopulate: jest.fn().mockResolvedValue(findOneResponseStub),
});
