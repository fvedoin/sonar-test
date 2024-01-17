import { OnlineAlertJobService } from './online-alert-job.service';
import { CreateOnlineAlertJobDto } from './dto/create-online-alert-job.dto';
import { UpdateOnlineAlertJobDto } from './dto/update-online-alert-job.dto';
export declare class OnlineAlertJobController {
    private readonly onlineAlertJobService;
    constructor(onlineAlertJobService: OnlineAlertJobService);
    create(createOnlineAlertJobDto: CreateOnlineAlertJobDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOnlineAlertJobDto: UpdateOnlineAlertJobDto): string;
    remove(id: string): string;
}
