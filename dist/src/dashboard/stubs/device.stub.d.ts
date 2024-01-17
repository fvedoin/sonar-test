import { Types } from 'mongoose';
export declare const devicesStub: (clientId?: Types.ObjectId) => {
    _id: Types.ObjectId;
    allows: string[];
    clientId: Types.ObjectId;
    devId: string;
    type: string;
    communication: string;
    bucketId: string;
    description: any;
    name: string;
    applicationId: string;
};
