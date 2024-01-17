import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
export declare class AlertService {
    create(createAlertDto: CreateAlertDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAlertDto: UpdateAlertDto): string;
    remove(id: number): string;
}
