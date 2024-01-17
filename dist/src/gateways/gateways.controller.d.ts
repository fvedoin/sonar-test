/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { LinkGatewayDto } from './dto/link-gateway.dto';
import { GatewaysService } from './gateways.service';
export declare class GatewaysController {
    private readonly gatewaysService;
    constructor(gatewaysService: GatewaysService);
    findAll(user: UserFromJwt): Promise<any[]>;
    filterByClients(user: UserFromJwt, clientId: string): Promise<any>;
    findOne(ttnId: string): Promise<{
        name: any;
        _id: import("mongoose").Types.ObjectId;
        clientId: import("mongoose").LeanDocument<import("mongoose").Document<unknown, any, import("../clients/entities/client.entity").Client> & import("../clients/entities/client.entity").Client & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>>[];
        online: boolean;
        location: import("./models/PointSchema").Point;
        ttnId: string;
        lastChecked: Date;
    } | {
        name: any;
    }>;
    update(ttnId: string, linkGatewayDto: LinkGatewayDto): Promise<import("./entities/gateway.entity").Gateway>;
}
