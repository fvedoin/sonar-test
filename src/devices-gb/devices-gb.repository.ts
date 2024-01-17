import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Connection,
  FilterQuery,
  AggregateOptions,
  PipelineStage,
  ClientSession,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { DeviceGb } from './entities/devices-gb.entity';
import { AlertRepository } from 'src/alert/alert.repository';
import { MeterChangeRepository } from 'src/meter-change/meter-change.repository';
import { CutConnectRepository } from 'src/cut-reconnect/cut-reconnect.repository';
import { LastReceivedsRepository } from 'src/last-receiveds/last-receiveds.repository';
import { InfluxConnectionRepository } from 'src/influx-connections/influx-connections.repository';
import { InfluxBucketRepository } from 'src/influx-buckets/influx-buckets.repository';
import { OfflineAlertJobRepository } from 'src/offline-alert-job/offline-alert-job.repository';
import { OnlineAlertJobRepository } from 'src/online-alert-job/job.repository';
import { InfluxBucketDocument } from 'src/influx-buckets/entities/influx-bucket.entity';
import { Uc } from 'src/ucs/entities/uc.entity';
import { JobRepository } from 'src/job/job.repository';
import { UcsRepository } from 'src/ucs/ucs.repository';

@Injectable()
export class DevicesGbRepository extends AbstractRepository<DeviceGb> {
  constructor(
    @InjectModel(DeviceGb.name) private deviceGbModel: Model<DeviceGb>,
    private readonly alertRepository: AlertRepository,
    private readonly meterChangeRepository: MeterChangeRepository,
    private readonly cutReconnectRepository: CutConnectRepository,
    private readonly lastReceivedRepository: LastReceivedsRepository,
    private readonly influxConnectionRepository: InfluxConnectionRepository,
    private readonly influxBucketRepository: InfluxBucketRepository,
    private readonly ucRepository: UcsRepository,
    private readonly offlineAlertJobRepository: OfflineAlertJobRepository,
    private readonly onlineAlertJobRepository: OnlineAlertJobRepository,
    private readonly jobRepository: JobRepository,
    @InjectConnection() connection: Connection,
  ) {
    super(deviceGbModel, connection);
  }

  async migrateDevices({
    oldDevice,
    newDevice,
    uc,
    transactionSession,
  }: {
    oldDevice: DeviceGb;
    newDevice: DeviceGb;
    uc?: Uc;
    transactionSession: ClientSession;
  }) {
    try {
      const alerts = await this.alertRepository.findByDeviceId(oldDevice._id);

      for await (const alert of alerts) {
        await this.offlineAlertJobRepository.remove({
          deviceId: alert.deviceId,
          alertId: alert._id,
        });
      }

      const alreadyInstalled = await this.lastReceivedRepository.findByDeviceId(
        newDevice._id,
      );

      if (!alreadyInstalled || alreadyInstalled.length === 0) {
        await this.lastReceivedRepository.updateDeviceId(
          oldDevice._id,
          newDevice._id,
          transactionSession,
        );
      } else {
        await this.lastReceivedRepository.deleteMany(
          { deviceId: oldDevice._id },
          transactionSession,
        );
      }

      await this.alertRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );

      await this.meterChangeRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );
      await this.cutReconnectRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );
      await this.jobRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );

      if (uc) {
        await this.ucRepository.updateDeviceId(
          oldDevice._id,
          newDevice._id,
          transactionSession,
        );
      }

      await this.offlineAlertJobRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );
      await this.onlineAlertJobRepository.updateDeviceId(
        oldDevice._id,
        newDevice._id,
        transactionSession,
      );

      return;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteMany(options: FilterQuery<Transformer>) {
    await this.deviceGbModel.deleteMany(options);
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.deviceGbModel.aggregate(pipeline, options);
  }

  async findById(id: string) {
    return await this.deviceGbModel.findById(id).exec();
  }

  async findByIdPopulate(id: string, populate: string[]) {
    return await this.deviceGbModel.findById(id).populate(populate);
  }

  async findAllJoinByDevId(devId) {
    const device = await this.deviceGbModel
      .aggregate([
        {
          $match: {
            devId: devId,
          },
        },
        {
          $lookup: {
            from: 'alerts',
            localField: '_id',
            foreignField: 'deviceId',
            as: 'alerts',
          },
        },
        {
          $unwind: {
            path: '$alerts',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'ucs',
            localField: '_id',
            foreignField: 'deviceId',
            as: 'uc',
          },
        },
        {
          $unwind: {
            path: '$uc',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'settings',
            localField: 'clientId',
            foreignField: 'clientId',
            as: 'settings',
          },
        },
        {
          $unwind: {
            path: '$settings',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            uc: { $first: '$uc' },
            settings: { $first: '$settings' },
            devId: { $first: '$devId' },
            applicationId: { $first: '$applicationId' },
            alerts: { $push: '$alerts' },
          },
        },
        {
          $project: {
            _id: 1,
            applicationId: 1,
            devId: 1,
            alerts: {
              $filter: {
                input: '$alerts',
                as: 'a',
                cond: { $ifNull: ['$$a._id', false] },
              },
            },
            uc: 1,
            settings: 1,
          },
        },
      ])
      .exec();
    return device;
  }
}
