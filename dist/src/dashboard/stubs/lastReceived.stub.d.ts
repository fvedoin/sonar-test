import { Types } from 'mongoose';
export declare const lastReceivedStub: (deviceId?: Types.ObjectId) => {
    deviceId: Types.ObjectId;
    receivedAt: Date;
};
