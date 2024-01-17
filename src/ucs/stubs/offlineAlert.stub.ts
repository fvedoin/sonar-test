import { Types } from 'mongoose';
import { CreateOfflineAlertJobDto } from 'src/offline-alert-job/dto/create-offline-alert-job.dto';

export const offlineAlertStubs = (
  _id: Types.ObjectId,
  dto: Partial<CreateOfflineAlertJobDto>,
) => ({
  _id,
  ...dto,
});

export const offlineAlertDtoStubs = (
  dto?: Partial<CreateOfflineAlertJobDto>,
): CreateOfflineAlertJobDto => {
  return {
    alertId: new Types.ObjectId().toString(),
    deviceId: new Types.ObjectId().toString(),
    createdAt: new Date(),
    triggerAt: new Date(),
    ...dto,
  };
};
