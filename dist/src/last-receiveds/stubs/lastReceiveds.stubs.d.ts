import { Types } from 'mongoose';
export declare const lastReceivedsStubs: () => {
    deviceId: Types.ObjectId;
    port: number;
    receivedAt: Date;
};
