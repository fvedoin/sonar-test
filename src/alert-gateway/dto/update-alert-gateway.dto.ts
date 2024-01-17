import { PartialType } from '@nestjs/swagger';
import { CreateAlertGatewayDto } from './create-alert-gateway.dto';

export class UpdateAlertGatewayDto extends PartialType(CreateAlertGatewayDto) {}
