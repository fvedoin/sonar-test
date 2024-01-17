import { Injectable } from '@nestjs/common';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { InfluxService } from 'src/influx/influx.service';
import { LastHourData, LastHourInflux, UcWithLastHour } from './interfaces';
import { UcsService } from 'src/ucs/ucs.service';
import { SettingsService } from 'src/settings/setting.service';
import { LastReceivedsService } from 'src/last-receiveds/last-receiveds.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { NotificationService } from 'src/notification/notification.service';
import { CutReconnectService } from 'src/cut-reconnect/cut-reconnect.service';
import { LeanDocument } from 'mongoose';
import { Notification } from 'src/notification/entities/notification.entity';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';
import { CutReconnect } from 'src/cut-reconnect/entities/cut-reconnect.entity';
import { EnergyService } from 'src/energy/energy.service';
import DataInfluxDashboardQuality from 'src/influx/interfaces/dataInfluxDashboardQuality';

export type ConsumeResult = {
  currentYearMonths: ConsumedYearlyData;
  lastYearMonths: ConsumedYearlyData;
  lastYear: number;
};

export type LastHourResult = {
  ucs: UcWithLastHour[];
  notifications: LeanDocument<Notification>[];
  consume?: ConsumeResult;
  quality?: QualityResult;
  settings: Setting;
};

export type UcDataResult = {
  cutReconnect: CutReconnect[];
} & UcWithLastHour;

export type ConsumedYearlyData = {
  currentMonth: number;
  lastMonth: number;
};

export type QualityValue = {
  value: number;
  field: string;
  devId: string;
  ucCode: string;
};

export type GroupedQuality = {
  [devId: string]: QualityValue[];
};

export type QualityResult = {
  [devId: string]: GroupedQuality;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly influxService: InfluxService,
    private readonly influxBucketsService: InfluxBucketsService,
    private readonly ucsService: UcsService,
    private readonly settingsService: SettingsService,
    private readonly lastRecevedsService: LastReceivedsService,
    private readonly notificationService: NotificationService,
    private readonly cutReconnectService: CutReconnectService,
    private readonly energyService: EnergyService,
  ) {}

  private getMinAndMaxFromLastHour(lastHour: LastHourInflux[]): LastHourData {
    const values = lastHour.map((item) => {
      return item._value;
    });
    return { min: Math.min(...values), max: Math.max(...values) };
  }

  private async getLastYearConsume(
    bucketName: string,
    now: Date,
    ucs: UcWithLastHour[],
    host: string,
    apiToken: string,
  ): Promise<number> {
    const lastYear = now.getFullYear() - 1;
    const start = new Date(lastYear, 7, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const result = await this.fetchConsume(
      ucs,
      bucketName,
      host,
      apiToken,
      start,
      end,
    );

    return result;
  }

  private async getConsumedYearlyData(
    bucketName: string,
    now: Date,
    year: number,
    ucs: UcWithLastHour[],
    host: string,
    apiToken: string,
  ): Promise<ConsumedYearlyData> {
    const startCurrentMonth = new Date(year, now.getMonth());
    const endCurrentMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

    const startLastMonth = new Date(year, now.getMonth() - 1);
    const endLastMonth = new Date(year, now.getMonth(), 0, 23, 59, 59);

    const [currentMonth, lastMonth] = await Promise.all([
      this.fetchConsume(
        ucs,
        bucketName,
        host,
        apiToken,
        startCurrentMonth,
        endCurrentMonth,
      ),
      this.fetchConsume(
        ucs,
        bucketName,
        host,
        apiToken,
        startLastMonth,
        endLastMonth,
      ),
    ]);

    return { currentMonth, lastMonth };
  }

  private async getStatus(device: DeviceGb, settings: Setting) {
    const dayInSeconds = 86400;
    const MinuteInSeconds = 60;
    const now = new Date().getTime();
    const offlineTime = settings.offlineTime * MinuteInSeconds || dayInSeconds;
    let status = 'Sem status';

    const responseLastReceived = await this.lastRecevedsService.find(
      {
        deviceId: device._id,
      },
      { _id: 0, receivedAt: 1 },
    );

    const lastTimeUnix = Math.max(
      ...responseLastReceived.map((item) => item.receivedAt.getTime()),
    );

    if (device.devId.includes('ucd')) {
      status = 'Desabilitada';
    } else if (device.communication) {
      status = now - lastTimeUnix > offlineTime * 1000 ? 'Offline' : 'Online';
    }

    return status;
  }

  private async fetchUcs(clientId: string): Promise<UcWithLastHour[]> {
    const ucs = await this.ucsService.findWhere(
      { clientId, deviceId: { $exists: true } },
      { _id: 0, ucCode: 1, deviceId: 1, ratedVoltage: 1 },
    );

    return ucs.filter((uc) => !!(uc.deviceId as DeviceGb)?.devId);
  }

  private async fetchSettings(clientId: string): Promise<Setting> {
    try {
      return await this.settingsService.find({ clientId }, { _id: 0 });
    } catch (error) {
      return this.settingsService.getDefaultSettings();
    }
  }

  private async fetchBucket(clientId: string): Promise<InfluxBucket> {
    return this.influxBucketsService.findOneWhere({
      clientId,
      product: 'telemedicao-b',
    });
  }

  private async fetchNotifications(
    clientId: string,
  ): Promise<LeanDocument<Notification>[]> {
    return await this.notificationService.findByClientId(clientId, {
      _id: 0,
      message: 1,
      title: 1,
      createdAt: 1,
    });
  }

  private async fetchConsume(
    ucs: UcWithLastHour[],
    bucketName: string,
    host: string,
    apiToken: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    const devsIds = ucs.map((item) => (item.deviceId as DeviceGb).devId);

    const data = await this.energyService.findEnergyTotal({
      field: 'consumed_total_energy',
      devsIds: devsIds,
      begin: Math.round(start.getTime() / 1000),
      end: Math.round(end.getTime() / 1000),
      urlDb: host,
      tokenDb: apiToken,
      bucket: bucketName,
    });

    const response = data.find((item: any) => item.result === '_result');

    return response?._value ?? 0;
  }

  private formatQualityResult(
    qualities: DataInfluxDashboardQuality[],
    ucs: UcWithLastHour[],
  ): QualityResult {
    const groupedData = {};

    for (const quality of qualities) {
      const { _value, _field, dev_id, result } = quality;

      if (!groupedData[result]) {
        groupedData[result] = {};
      }

      if (!groupedData[result][dev_id]) {
        groupedData[result][dev_id] = [];
      }

      const ucCode = this.getUcCodeByDevId(ucs, dev_id);

      const dataPoint: QualityValue = {
        value: _value,
        field: _field,
        devId: dev_id,
        ucCode,
      };

      groupedData[result][dev_id].push(dataPoint);
    }

    return groupedData;
  }

  private getUcCodeByDevId(ucs: UcWithLastHour[], devId: string) {
    const uc = ucs.find((uc) => (uc.deviceId as DeviceGb).devId === devId);
    return uc.ucCode;
  }

  private async fetchQuality(ucs: UcWithLastHour[], bucket: string) {
    const startDate = '-7d';
    const endDate = 'now()';
    const devsIds = ucs.map((item) => (item.deviceId as DeviceGb).devId);

    const quality = await this.influxService.dashboardQuality({
      bucket,
      devsIds,
      startDate,
      endDate,
    });

    return this.formatQualityResult(quality, ucs);
  }

  private async fetchUcsData(
    uc: UcWithLastHour,
    settings: Setting,
    bucket: InfluxBucket,
    host: string,
    apiToken: string,
  ): Promise<UcDataResult> {
    const device = uc.deviceId as DeviceGb;
    const lastHour = await this.influxService.lastHour({
      apiToken,
      bucket: bucket.name,
      devId: device.devId,
      host,
    });
    const lastHourData = this.getMinAndMaxFromLastHour(lastHour);
    const status = await this.getStatus(device, settings);
    const cutReconnect = await this.cutReconnectService.findWhere({
      deviceId: device._id,
    });

    return {
      ...uc,
      lastHour: lastHourData,
      status,
      cutReconnect,
    };
  }

  private async fetchConsumeData(
    bucketName: string,
    ucs: UcWithLastHour[],
    host: string,
    apiToken: string,
  ) {
    const now = new Date();

    const [currentYearMonths, lastYearMonths, lastYear] = await Promise.all([
      this.getConsumedYearlyData(
        bucketName,
        now,
        now.getFullYear(),
        ucs,
        host,
        apiToken,
      ),
      this.getConsumedYearlyData(
        bucketName,
        now,
        now.getFullYear() - 1,
        ucs,
        host,
        apiToken,
      ),
      this.getLastYearConsume(bucketName, now, ucs, host, apiToken),
    ]);

    return {
      currentYearMonths,
      lastYearMonths,
      lastYear,
    };
  }

  async lastHour(clientId: string): Promise<LastHourResult> {
    const host = process.env.INFLUX_HOST;
    const apiToken = process.env.INFLUX_API_TOKEN;

    const [ucs, settings, bucket, notifications] = await Promise.all([
      this.fetchUcs(clientId),
      this.fetchSettings(clientId),
      this.fetchBucket(clientId),
      this.fetchNotifications(clientId),
    ]);

    if (!bucket) {
      return {
        ucs: [],
        notifications,
        settings,
      };
    }

    const promises = ucs.map(async (uc) => {
      return this.fetchUcsData(uc, settings, bucket, host, apiToken);
    });

    const data: UcWithLastHour[] = await Promise.all(promises);

    const consume = await this.fetchConsumeData(
      bucket.name,
      data,
      host,
      apiToken,
    );

    const quality = await this.fetchQuality(data, bucket.name);

    return { ucs: data, notifications, consume, quality, settings };
  }
}
