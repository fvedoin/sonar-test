import { Types } from 'mongoose';
import { CreateInfluxConnectionDto } from 'src/influx-connections/dto/create-influx-connection.dto';
export declare const influxConnectionStub: (_id: Types.ObjectId, dto: Partial<CreateInfluxConnectionDto>) => {
    alias?: string;
    host?: string;
    apiToken?: string;
    orgId?: string;
    _id: Types.ObjectId;
    name: string;
};
export declare const influxConnectionStubDtoStubs: (dto?: Partial<CreateInfluxConnectionDto>) => CreateInfluxConnectionDto;
