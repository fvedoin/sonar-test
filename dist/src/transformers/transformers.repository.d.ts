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
import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection, FilterQuery, AggregateOptions, PipelineStage } from 'mongoose';
import { Transformer } from './entities/transformer.entity';
export declare class TransformersRepository extends AbstractRepository<Transformer> {
    private transformerModel;
    constructor(transformerModel: Model<Transformer>, connection: Connection);
    findAllAndPopulate(populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Transformer> & Transformer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    findWhereAndPopulate(where: FilterQuery<Transformer>, populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Transformer> & Transformer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    deleteMany(options: FilterQuery<Transformer>): Promise<void>;
    aggregate(pipeline: PipelineStage[], options?: AggregateOptions): Promise<any[]>;
}
