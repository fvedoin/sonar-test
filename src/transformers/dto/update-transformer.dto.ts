import { PartialType } from '@nestjs/swagger';

import { CreateTransformerDto } from './create-transformer.dto';

export class UpdateTransformerDto extends PartialType(CreateTransformerDto) {}
