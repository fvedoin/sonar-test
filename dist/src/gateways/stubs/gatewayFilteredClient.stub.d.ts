interface Gateway {
    ids: {
        gateway_id: string;
        eui: string;
    };
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    lastSeen: string;
    online: boolean;
    client: string;
    coordinates: [number, number];
    gateway_server_address: string;
    frequency_plan_id: string;
    frequency_plan_ids: string[];
}
export declare const findFilteredGatewaysResponseStub: Gateway[];
export {};
