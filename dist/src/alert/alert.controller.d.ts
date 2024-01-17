import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
export declare class AlertController {
    private readonly alertService;
    constructor(alertService: AlertService);
    create(createAlertDto: CreateAlertDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAlertDto: UpdateAlertDto): string;
    remove(id: string): string;
}
