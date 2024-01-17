import { Types } from 'mongoose';
interface Location {
    type: string;
    coordinates: [number, number];
    _id: string;
}
interface FindOneResponse {
    _id: Types.ObjectId;
    ttnId: string;
    __v: number;
    clientId: string[];
    lastChecked: string;
    online: boolean;
    location: Location;
    name: string;
}
export declare const findOneResponseStub: FindOneResponse;
export {};
