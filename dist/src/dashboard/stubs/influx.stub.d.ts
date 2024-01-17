import { LastHourInflux } from '../interfaces';
import { Types } from 'mongoose';
export declare const influxStub: () => LastHourInflux;
export declare const influxBucketStub: (clientId?: string) => {
    _id: Types.ObjectId;
    clientId: Types.ObjectId;
    influxConnectionId: Types.ObjectId;
    alias: string;
    product: string;
    name: string;
};
export declare const qualityStub: () => {
    _value: number;
    _field: string;
    dev_id: string;
    result: string;
};
