import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { TransformersRepository } from './transformers.repository';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import mongoose, { FilterQuery } from 'mongoose';
import { Transformer } from './entities/transformer.entity';
export declare class TransformersService {
    private readonly transformerRepository;
    constructor(transformerRepository: TransformersRepository);
    updateOrInsert(transformer: CreateTransformerDto): Promise<any>;
    findWhereAndPopulate(where: FilterQuery<Transformer>, populate: string[]): Promise<Omit<mongoose.Document<unknown, any, Transformer> & Transformer & Required<{
        _id: mongoose.Types.ObjectId;
    }>, never>[]>;
    findAllPopulate({ edges, searchText, filter, fieldMask }: any): Promise<{
        data: any;
        pageInfo: any;
    }>;
    find(where: any): Promise<(mongoose.Document<unknown, any, Transformer> & Transformer & Required<{
        _id: mongoose.Types.ObjectId;
    }>)[]>;
    filterTransformersDevice(clientId: string): Promise<{
        data: any;
        pageInfo: {
            count: any;
        };
    }>;
    findOne(id: string): Promise<Transformer>;
    findByIt(it: string): Promise<Transformer>;
    update(id: string, updateTransformerDto: UpdateTransformerDto): Promise<mongoose.Document<unknown, any, Transformer> & Transformer & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    remove(ids: string[]): Promise<void>;
}
