interface GatewayResponse {
    lastSeen: string;
    online: boolean;
    client: string;
    coordinates: [number, number];
    ids: {
        gateway_id: string;
        eui: string;
    };
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    gateway_server_address: string;
    frequency_plan_id: string;
    frequency_plan_ids: string[];
}
export declare const gatewayResponseStub: GatewayResponse;
export {};
