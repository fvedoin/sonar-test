import { PartialType } from '@nestjs/swagger';

import { CreateMqttAccessDto } from './create-mqtt-access.dto';

export class UpdateMqttAccessDto extends PartialType(CreateMqttAccessDto) {}
