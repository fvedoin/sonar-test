import { PartialType } from '@nestjs/swagger';

import { CreateInfluxConnectionDto } from './create-influx-connection.dto';

export class UpdateInfluxConnectionDto extends PartialType(
  CreateInfluxConnectionDto,
) {}
