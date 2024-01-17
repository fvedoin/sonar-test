import { alertGatewayStubs } from '../stubs/alertGateway.stub';
import { alertGatewayDtoStubs } from '../stubs/alertGatewayDTO.stub';

export const AlertGatewayService = jest.fn().mockReturnValue({
  remove: jest
    .fn()
    .mockResolvedValue(alertGatewayStubs(alertGatewayDtoStubs())),
});
