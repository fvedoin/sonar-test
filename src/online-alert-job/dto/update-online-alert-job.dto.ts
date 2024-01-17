import { PartialType } from '@nestjs/swagger';
import { CreateOnlineAlertJobDto } from './create-online-alert-job.dto';

export class UpdateOnlineAlertJobDto extends PartialType(
  CreateOnlineAlertJobDto,
) {}
