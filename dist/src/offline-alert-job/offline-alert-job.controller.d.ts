import { OfflineAlertJobService } from './offline-alert-job.service';
import { CreateOfflineAlertJobDto } from './dto/create-offline-alert-job.dto';
import { UpdateOfflineAlertJobDto } from './dto/update-offline-alert-job.dto';
export declare class OfflineAlertJobController {
    private readonly offlineAlertJobService;
    constructor(offlineAlertJobService: OfflineAlertJobService);
    create(createOfflineAlertJobDto: CreateOfflineAlertJobDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOfflineAlertJobDto: UpdateOfflineAlertJobDto): string;
    remove(id: string): string;
}
