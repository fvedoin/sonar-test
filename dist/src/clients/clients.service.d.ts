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
/// <reference types="mongoose/types/inferschematype" />
import { FilterQuery, ProjectionFields } from 'mongoose';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientDocument } from './entities/client.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsRepository } from './clients.repository';
export declare class ClientsService {
    private readonly clientsRepository;
    private readonly influxConnectionsService;
    private readonly influxBucketsService;
    constructor(clientsRepository: ClientsRepository, influxConnectionsService: InfluxConnectionsService, influxBucketsService: InfluxBucketsService);
    create(createClientDto: CreateClientDto, user: UserFromJwt): Promise<Client>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, Client> & Client & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findWhere(whereClause: FilterQuery<ClientDocument>): Promise<Client[]>;
    findOne(id: string, projection?: ProjectionFields<Client>): Promise<Client>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("mongoose").Document<unknown, any, Client> & Client & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<void>;
}
