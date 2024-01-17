import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection } from 'mongoose';
import { Client } from './entities/client.entity';
export declare class ClientsRepository extends AbstractRepository<Client> {
    private clientModel;
    constructor(clientModel: Model<Client>, connection: Connection);
}
