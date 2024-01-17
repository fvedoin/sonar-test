import { PartialType } from '@nestjs/swagger';

import { CreateDevicesTrDto } from './create-devices-tr.dto';

export class UpdateDevicesTrDto extends PartialType(CreateDevicesTrDto) {}
