import * as mongoose from 'mongoose';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
export declare class ApplicationsController {
    private readonly connection;
    private readonly applicationsService;
    constructor(connection: mongoose.Connection, applicationsService: ApplicationsService);
    create(createApplicationDto: CreateApplicationDto): Promise<mongoose.Document<unknown, any, Application> & Application & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findAll(clientId: any): Promise<{
        synchronized: any[];
        unsynchronized: any[];
    }>;
    findOne(appId: string): Promise<{
        ttnSync: boolean;
        name: string;
        description: string;
        appId: string;
        clientId: mongoose.LeanDocument<mongoose.Document<unknown, any, import("../clients/entities/client.entity").Client> & import("../clients/entities/client.entity").Client & Required<{
            _id: mongoose.Types.ObjectId;
        }>>;
        token: string;
        _id: mongoose.Types.ObjectId;
    }>;
    update(appId: string, updateApplicationDto: UpdateApplicationDto): Promise<mongoose.Document<unknown, any, Application> & Application & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    remove(appIds: string): Promise<{
        deleted: boolean;
    }>;
}
