import { PartialType } from '@nestjs/swagger';
import { CreateDevicesGaDto } from './create-devices-ga.dto';

export class UpdateDevicesGaDto extends PartialType(CreateDevicesGaDto) {}
