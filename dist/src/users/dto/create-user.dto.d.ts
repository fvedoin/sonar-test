export declare class CreateUserDto {
    username: string;
    name: string;
    phone?: string;
    accessLevel: string;
    clientId: string;
    password: string;
    modules: string[];
    attempts?: number;
}
