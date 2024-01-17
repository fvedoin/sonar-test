export interface UserPayload {
    sub: string;
    username: string;
    name: string;
    modules: string[];
    accessLevel: string;
    clientId: string;
    iat?: number;
    exp?: number;
}
