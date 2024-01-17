import { Types } from 'mongoose';
export declare const deviceGBStub: (id: string) => {
    _id: Types.ObjectId;
    allows: any[];
    clientId: Types.ObjectId;
    devId: string;
    bucketId: Types.ObjectId;
    name: string;
    communication: string;
    type: string;
    description: string;
    applicationId: Types.ObjectId;
};
