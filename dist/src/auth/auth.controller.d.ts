import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthRequest } from './models/AuthRequest';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(createUserDto: AuthUserDto, req: AuthRequest): Promise<import("./models/UserToken").UserToken>;
    createResetPasswordToken({ username }: {
        username: string;
    }): Promise<{}>;
    resetPassword({ userId, password, token, }: {
        userId: string;
        password: string;
        token: string;
    }): Promise<void>;
}
