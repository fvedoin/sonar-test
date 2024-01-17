import { Types } from 'mongoose';
import { CreateAlertGatewayDto } from '../dto/create-alert-gateway.dto';

export const alertGatewayDtoStubs = (
  dto?: Partial<CreateAlertGatewayDto>,
): CreateAlertGatewayDto => {
  return {
    clientId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    emails: ['test@example.com'],
    interval: 2,
    status: 'active',
    ttnId: 'ttn123',
    enabled: true,
    ...dto,
  };
};
