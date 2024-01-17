/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection, FilterQuery, AggregateOptions, PipelineStage, ClientSession } from 'mongoose';
import { DeviceGb } from './entities/devices-gb.entity';
import { AlertRepository } from 'src/alert/alert.repository';
import { MeterChangeRepository } from 'src/meter-change/meter-change.repository';
import { CutConnectRepository } from 'src/cut-reconnect/cut-reconnect.repository';
import { LastReceivedsRepository } from 'src/last-receiveds/last-receiveds.repository';
import { InfluxConnectionRepository } from 'src/influx-connections/influx-connections.repository';
import { InfluxBucketRepository } from 'src/influx-buckets/influx-buckets.repository';
import { OfflineAlertJobRepository } from 'src/offline-alert-job/offline-alert-job.repository';
import { OnlineAlertJobRepository } from 'src/online-alert-job/job.repository';
import { Uc } from 'src/ucs/entities/uc.entity';
import { JobRepository } from 'src/job/job.repository';
import { UcsRepository } from 'src/ucs/ucs.repository';
export declare class DevicesGbRepository extends AbstractRepository<DeviceGb> {
    private deviceGbModel;
    private readonly alertRepository;
    private readonly meterChangeRepository;
    private readonly cutReconnectRepository;
    private readonly lastReceivedRepository;
    private readonly influxConnectionRepository;
    private readonly influxBucketRepository;
    private readonly ucRepository;
    private readonly offlineAlertJobRepository;
    private readonly onlineAlertJobRepository;
    private readonly jobRepository;
    constructor(deviceGbModel: Model<DeviceGb>, alertRepository: AlertRepository, meterChangeRepository: MeterChangeRepository, cutReconnectRepository: CutConnectRepository, lastReceivedRepository: LastReceivedsRepository, influxConnectionRepository: InfluxConnectionRepository, influxBucketRepository: InfluxBucketRepository, ucRepository: UcsRepository, offlineAlertJobRepository: OfflineAlertJobRepository, onlineAlertJobRepository: OnlineAlertJobRepository, jobRepository: JobRepository, connection: Connection);
    migrateDevices({ oldDevice, newDevice, uc, transactionSession, }: {
        oldDevice: DeviceGb;
        newDevice: DeviceGb;
        uc?: Uc;
        transactionSession: ClientSession;
    }): Promise<void>;
    deleteMany(options: FilterQuery<Transformer>): Promise<void>;
    aggregate(pipeline: PipelineStage[], options?: AggregateOptions): Promise<any[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, any, DeviceGb> & DeviceGb & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findByIdPopulate(id: string, populate: string[]): Promise<import("mongoose").Document<unknown, any, DeviceGb> & DeviceGb & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAllJoinByDevId(devId: any): Promise<any[]>;
}
