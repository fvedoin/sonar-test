import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserToken } from './models/UserToken';
import { TokenService } from 'src/token/token.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    private readonly tokenService;
    private readonly rabbitMQService;
    constructor(jwtService: JwtService, userService: UsersService, tokenService: TokenService, rabbitMQService: RabbitMQService);
    login(user: UserDocument): Promise<UserToken>;
    validateUser(email: string, password: string): Promise<User>;
    requestPasswordReset(username: string): Promise<{}>;
    resetPassword({ userId, password, token, }: {
        userId: string;
        password: string;
        token: string;
    }): Promise<void>;
}
