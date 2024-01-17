import { CreateOfflineAlertJobDto } from './dto/create-offline-alert-job.dto';
import { UpdateOfflineAlertJobDto } from './dto/update-offline-alert-job.dto';
export declare class OfflineAlertJobService {
    create(createOfflineAlertJobDto: CreateOfflineAlertJobDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOfflineAlertJobDto: UpdateOfflineAlertJobDto): string;
    remove(id: number): string;
}
