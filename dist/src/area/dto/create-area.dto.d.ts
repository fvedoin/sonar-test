import { Types } from 'mongoose';
interface ReceivedPoint {
    lat: number;
    lng: number;
}
export declare class CreateAreaDto {
    name: string;
    clientId: Types.ObjectId | string;
    points: ReceivedPoint[];
}
export {};
