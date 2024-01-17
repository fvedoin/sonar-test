import { PartialType } from '@nestjs/swagger';
import { CreateUcdisabledHistoryDto } from './create-ucdisabled-history.dto';

export class UpdateUcdisabledHistoryDto extends PartialType(
  CreateUcdisabledHistoryDto,
) {}
