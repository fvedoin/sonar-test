import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxService } from 'src/influx/influx.service';
import { EventCreateCSV } from '../dto/event-create-csv.dto';
import { EventCreateCSVQuality } from '../dto/event-create-csv-quality.dto';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { NotificationService } from 'src/notification/notification.service';
export declare class CreateCSVListener {
    private readonly influxService;
    private readonly influxBucketsService;
    private readonly awsS3ManagerService;
    private readonly notificationService;
    constructor(influxService: InfluxService, influxBucketsService: InfluxBucketsService, awsS3ManagerService: AwsS3ManagerService, notificationService: NotificationService);
    private getDateTime;
    private saveInS3;
    private generateQuery;
    private convertItemsToLabels;
    private processFields;
    private combineData;
    private processDataItem;
    createCSV(data: EventCreateCSV): Promise<void>;
    createCSVQuality(data: EventCreateCSVQuality): Promise<void>;
}
