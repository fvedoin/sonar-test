import { InfluxService } from 'src/influx/influx.service';
import { UcWithLastHour } from './interfaces';
import { UcsService } from 'src/ucs/ucs.service';
import { SettingsService } from 'src/settings/setting.service';
import { LastReceivedsService } from 'src/last-receiveds/last-receiveds.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { NotificationService } from 'src/notification/notification.service';
import { CutReconnectService } from 'src/cut-reconnect/cut-reconnect.service';
import { LeanDocument } from 'mongoose';
import { Notification } from 'src/notification/entities/notification.entity';
import { CutReconnect } from 'src/cut-reconnect/entities/cut-reconnect.entity';
import { EnergyService } from 'src/energy/energy.service';
export declare type ConsumeResult = {
    currentYearMonths: ConsumedYearlyData;
    lastYearMonths: ConsumedYearlyData;
    lastYear: number;
};
export declare type LastHourResult = {
    ucs: UcWithLastHour[];
    notifications: LeanDocument<Notification>[];
    consume?: ConsumeResult;
    quality?: QualityResult;
    settings: Setting;
};
export declare type UcDataResult = {
    cutReconnect: CutReconnect[];
} & UcWithLastHour;
export declare type ConsumedYearlyData = {
    currentMonth: number;
    lastMonth: number;
};
export declare type QualityValue = {
    value: number;
    field: string;
    devId: string;
    ucCode: string;
};
export declare type GroupedQuality = {
    [devId: string]: QualityValue[];
};
export declare type QualityResult = {
    [devId: string]: GroupedQuality;
};
export declare class DashboardService {
    private readonly influxService;
    private readonly influxBucketsService;
    private readonly ucsService;
    private readonly settingsService;
    private readonly lastRecevedsService;
    private readonly notificationService;
    private readonly cutReconnectService;
    private readonly energyService;
    constructor(influxService: InfluxService, influxBucketsService: InfluxBucketsService, ucsService: UcsService, settingsService: SettingsService, lastRecevedsService: LastReceivedsService, notificationService: NotificationService, cutReconnectService: CutReconnectService, energyService: EnergyService);
    private getMinAndMaxFromLastHour;
    private getLastYearConsume;
    private getConsumedYearlyData;
    private getStatus;
    private fetchUcs;
    private fetchSettings;
    private fetchBucket;
    private fetchNotifications;
    private fetchConsume;
    private formatQualityResult;
    private getUcCodeByDevId;
    private fetchQuality;
    private fetchUcsData;
    private fetchConsumeData;
    lastHour(clientId: string): Promise<LastHourResult>;
}
