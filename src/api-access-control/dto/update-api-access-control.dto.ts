import { PartialType } from '@nestjs/swagger';

import { CreateApiAccessControlDto } from './create-api-access-control.dto';

export class UpdateApiAccessControlDto extends PartialType(
  CreateApiAccessControlDto,
) {}
