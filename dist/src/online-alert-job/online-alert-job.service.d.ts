import { CreateOnlineAlertJobDto } from './dto/create-online-alert-job.dto';
import { UpdateOnlineAlertJobDto } from './dto/update-online-alert-job.dto';
export declare class OnlineAlertJobService {
    create(createOnlineAlertJobDto: CreateOnlineAlertJobDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOnlineAlertJobDto: UpdateOnlineAlertJobDto): string;
    remove(id: number): string;
}
