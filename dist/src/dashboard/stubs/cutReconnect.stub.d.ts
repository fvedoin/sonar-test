import { Types } from 'mongoose';
export declare const cutReconnectStub: (id?: Types.ObjectId) => {
    _id: Types.ObjectId;
    name: string;
    type: number;
    deviceId: string;
    userId: string;
    status: string;
    tech: string;
};
