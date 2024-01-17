import { AlertGatewayService } from './alert-gateway.service';
export declare class AlertGatewayController {
    private readonly alertGatewayService;
    constructor(alertGatewayService: AlertGatewayService);
    remove(id: string): Promise<void>;
}
