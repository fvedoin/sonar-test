import { Types } from 'mongoose';
import { CreateDevicesGbDto } from 'src/devices-gb/dto/create-devices-gb.dto';
export declare const deviceGBStub: (id?: string, dto?: Partial<CreateDevicesGbDto>) => {
    name: string;
    devId: string;
    databaseId?: string;
    devEui?: string;
    appEui?: string;
    lorawanVersion?: string;
    lorawanPhyVersion?: string;
    frequencyPlanId?: string;
    supportsJoin?: string;
    appKey?: string;
    password?: string;
    topics?: string[];
    username?: string;
    type: string;
    description: string;
    communication: string;
    allows: string[];
    clientId: string | Types.ObjectId;
    bucketId: string | Types.ObjectId;
    applicationId: string | Types.ObjectId;
    brokerAttributeId?: string;
    _id: Types.ObjectId;
};
