import { PartialType } from '@nestjs/swagger';

import { CreateUcDto } from './create-uc.dto';

export class UpdateUcDto extends PartialType(CreateUcDto) {}
