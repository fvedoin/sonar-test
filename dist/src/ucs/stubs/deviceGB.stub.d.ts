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
import { Types } from 'mongoose';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
export declare const deviceGBStub: (id?: string, deviceGb?: Partial<DeviceGb>) => {
    clientId: string | Types.ObjectId | import("../../clients/entities/client.entity").Client;
    applicationId: string | Types.ObjectId | (import("mongoose").Document<unknown, any, import("../../applications/entities/application.entity").Application> & import("../../applications/entities/application.entity").Application & {
        _id: Types.ObjectId;
    });
    bucketId: string | Types.ObjectId | import("../../influx-buckets/entities/influx-bucket.entity").InfluxBucket;
    communication: string;
    type: string;
    devId: string;
    name: string;
    description: string;
    allows: string[];
    _id: Types.ObjectId;
};
