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
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { CreateInfluxConnectionDto } from './dto/create-influx-connection.dto';
import { PingInfluxConnectionDto } from './dto/ping-influx-connection.dto';
import { UpdateInfluxConnectionDto } from './dto/update-influx-connection.dto';
import { InfluxConnectionsService } from './influx-connections.service';
export declare class InfluxConnectionsController {
    private readonly influxConnectionsService;
    private readonly influxBucketsService;
    constructor(influxConnectionsService: InfluxConnectionsService, influxBucketsService: InfluxBucketsService);
    create(createInfluxConnectionDto: CreateInfluxConnectionDto): Promise<import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    ping(pingInfluxConnectionDto: PingInfluxConnectionDto): Promise<void>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findBuckets(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, any, import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket> & import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket> & import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket> & import("../influx-buckets/entities/influx-bucket.entity").InfluxBucket & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateInfluxConnectionDto: UpdateInfluxConnectionDto): Promise<import("mongoose").Document<unknown, any, import("./entities/influx-connection.entity").InfluxConnection> & import("./entities/influx-connection.entity").InfluxConnection & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
