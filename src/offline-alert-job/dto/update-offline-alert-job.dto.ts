import { PartialType } from '@nestjs/swagger';
import { CreateOfflineAlertJobDto } from './create-offline-alert-job.dto';

export class UpdateOfflineAlertJobDto extends PartialType(
  CreateOfflineAlertJobDto,
) {}
