import mongoose, { FilterQuery } from 'mongoose';
import { LinkGatewayDto } from './dto/link-gateway.dto';
import { GatewayDocument } from './entities/gateway.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { GatewaysRepository } from './gateways.repository';
export declare class GatewaysService {
    private readonly gatewayRepository;
    constructor(gatewayRepository: GatewaysRepository);
    private getStatusForGateway;
    private getLinkedInfoForGateway;
    private shouldIncludeGateway;
    private getDeviceInfo;
    private formatGatewayData;
    private linkGateway;
    private handleAdminRouteForFilteredGateways;
    private handleNonAdminRouteForFilteredGateways;
    findOneWhere(where: FilterQuery<GatewayDocument>, populate?: string): Promise<mongoose.Document<unknown, any, import("./entities/gateway.entity").Gateway> & import("./entities/gateway.entity").Gateway & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findAll(user: UserFromJwt): Promise<any[]>;
    filterByClients(user: UserFromJwt, clientId: string): Promise<any>;
    findOne(ttnId: string): Promise<{
        name: any;
        _id: mongoose.Types.ObjectId;
        clientId: mongoose.LeanDocument<mongoose.Document<unknown, any, import("../clients/entities/client.entity").Client> & import("../clients/entities/client.entity").Client & Required<{
            _id: mongoose.Types.ObjectId;
        }>>[];
        online: boolean;
        location: import("./models/PointSchema").Point;
        ttnId: string;
        lastChecked: Date;
    } | {
        name: any;
    }>;
    link(ttnId: string, linkGatewayDto: LinkGatewayDto): Promise<import("./entities/gateway.entity").Gateway>;
}
