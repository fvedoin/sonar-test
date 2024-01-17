export declare class CreateMqttAccessDto {
    username: string;
    name: string;
    devId: string;
    isSuperUser?: boolean;
    encryptedPassword: string;
    permission?: string;
    action?: string;
    topics: string[];
    type: string;
}
