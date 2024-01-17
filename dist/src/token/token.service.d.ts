import { TokenRepository } from './token.repository';
export declare class TokenService {
    private readonly tokenRepository;
    constructor(tokenRepository: TokenRepository);
    create(userId: string): Promise<string>;
    compare(userId: string, token: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<void>;
}
