/// <reference types="multer" />
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsService } from 'src/clients/clients.service';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import { FindTransformersDto } from './dto/find-transformers.dto';
import { ProcessFileDto } from './dto/process-file.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { TransformersService } from './transformers.service';
import { UsersService } from 'src/users/users.service';
import mongoose from 'mongoose';
export declare class TransformersController {
    private readonly transformersService;
    private readonly clientsService;
    private readonly usersService;
    constructor(transformersService: TransformersService, clientsService: ClientsService, usersService: UsersService);
    postMany(data: CreateTransformerDto[]): Promise<void>;
    processTxt({ clientId }: ProcessFileDto, file: Express.Multer.File, user: UserFromJwt): Promise<any[]>;
    findAll(query: FindTransformersDto, user: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
    filterTransformersDevice(clientId: string): Promise<{
        data: any;
        pageInfo: {
            count: any;
        };
    }>;
    findOne(id: string): Promise<import("./entities/transformer.entity").Transformer>;
    update(id: string, updateTransformerDto: UpdateTransformerDto, user: UserFromJwt): Promise<mongoose.Document<unknown, any, import("./entities/transformer.entity").Transformer> & import("./entities/transformer.entity").Transformer & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    remove(ids: string): Promise<void>;
}
