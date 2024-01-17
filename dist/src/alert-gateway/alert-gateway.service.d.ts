import { AlertGatewayRepository } from './alert-gateway.repository';
export declare class AlertGatewayService {
    private readonly alertGatewayRepository;
    constructor(alertGatewayRepository: AlertGatewayRepository);
    remove(id: string[]): Promise<void>;
}
