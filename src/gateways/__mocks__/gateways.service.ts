import { gatewayResponseStubFromTtn } from '../stubs/gateway.stub';
import { findFilteredGatewaysResponseStub } from '../stubs/gatewayFilteredClient.stub';
import { findOneResponseStub } from '../stubs/gatewayFindOne.stub';
import { linkGatewaysDtoStubs } from '../stubs/linkGatewayDTO.stub';

export const GatewaysService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([gatewayResponseStubFromTtn]),
  findOne: jest.fn().mockResolvedValue(findOneResponseStub),
  filterByClients: jest
    .fn()
    .mockResolvedValue(findFilteredGatewaysResponseStub),
  update: jest.fn().mockResolvedValue(linkGatewaysDtoStubs),
  link: jest.fn().mockResolvedValue(findOneResponseStub),
});
