import { PartialType } from '@nestjs/swagger';

import { CreateDevicesGbDto } from './create-devices-gb.dto';

export class UpdateDevicesGbDto extends PartialType(CreateDevicesGbDto) {}
