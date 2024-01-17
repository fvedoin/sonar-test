import { Types } from 'mongoose';
import { CreateAlertGatewayDto } from '../dto/create-alert-gateway.dto';
import { AlertGateway } from '../entities/alert-gateway.entity';

export const alertGatewayStubs = (
  alertGatewayDtoStubs: CreateAlertGatewayDto,
): AlertGateway => {
  return {
    ...alertGatewayDtoStubs,
    _id: new Types.ObjectId('4edd40c86762e0fb12000003'),
  };
};
