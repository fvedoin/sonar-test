import { PartialType } from '@nestjs/swagger';

import { CreateMeterChangeDto } from './create-meter-change.dto';

export class UpdateMeterChangeDto extends PartialType(CreateMeterChangeDto) {}
