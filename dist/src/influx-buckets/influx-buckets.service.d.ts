import { Document, FilterQuery, Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { CreateInfluxBucketDto } from './dto/create-influx-bucket.dto';
import { UpdateInfluxBucketDto } from './dto/update-influx-bucket.dto';
import { InfluxBucket, InfluxBucketDocument } from './entities/influx-bucket.entity';
export declare class InfluxBucketsService {
    private influxBucketModel;
    private readonly connection;
    private readonly influxConnectionsService;
    constructor(influxBucketModel: Model<InfluxBucketDocument>, connection: mongoose.Connection, influxConnectionsService: InfluxConnectionsService);
    create(createInfluxBucketDto: CreateInfluxBucketDto): Promise<Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>>;
    findOne(id: string | (Document<unknown, any, InfluxBucket> & InfluxBucket & {
        _id: Types.ObjectId;
    }), populate?: string, projection?: FilterQuery<InfluxBucket>): mongoose.Query<Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>>;
    findOneWhere(where: FilterQuery<InfluxBucketDocument>): mongoose.Query<Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>>;
    findByInfluxConnection(id: string): mongoose.Query<(Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>)[], Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>>;
    update(id: string, updateInfluxBucketDto: UpdateInfluxBucketDto): mongoose.Query<Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxBucket> & InfluxBucket & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
