import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Connection, Model } from 'mongoose';
import { AlertGateway } from './entities/alert-gateway.entity';
export declare class AlertGatewayRepository extends AbstractRepository<AlertGateway> {
    private alertModel;
    constructor(alertModel: Model<AlertGateway>, connection: Connection);
    deleteMany(where: any): Promise<void>;
}
