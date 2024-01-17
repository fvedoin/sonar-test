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
import { ClientsService } from 'src/clients/clients.service';
import { CreateInfluxBucketDto } from './dto/create-influx-bucket.dto';
import { UpdateInfluxBucketDto } from './dto/update-influx-bucket.dto';
import { InfluxBucketsService } from './influx-buckets.service';
export declare class InfluxBucketsController {
    private readonly influxBucketsService;
    private readonly clientsService;
    constructor(influxBucketsService: InfluxBucketsService, clientsService: ClientsService);
    create(createInfluxBucketDto: CreateInfluxBucketDto): Promise<import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateInfluxBucketDto: UpdateInfluxBucketDto): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/influx-bucket.entity").InfluxBucket> & import("./entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
