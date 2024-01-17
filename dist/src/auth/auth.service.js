"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const token_service_1 = require("../token/token.service");
const rabbit_mq_service_1 = require("../rabbit-mq/rabbit-mq.service");
let AuthService = class AuthService {
    constructor(jwtService, userService, tokenService, rabbitMQService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.tokenService = tokenService;
        this.rabbitMQService = rabbitMQService;
    }
    async login(user) {
        const payload = {
            sub: String(user._id.toString()),
            username: user.username,
            name: user.name,
            accessLevel: user.accessLevel,
            modules: user.modules,
            clientId: user.clientId.toString(),
        };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            }),
        };
    }
    async validateUser(email, password) {
        const user = await this.userService.findCompleteByUsername(email);
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                return user;
            }
        }
        throw new Error('Email address or password provided is incorrect.');
    }
    async requestPasswordReset(username) {
        if (!username)
            throw new Error('Email address provided is incorrect.');
        const user = await this.userService.findCompleteByUsername(username);
        if (!user)
            throw new Error('Email address provided is incorrect.');
        const token = await this.tokenService.create(user._id.toString());
        const link = `https://app.spinon.com.br/password-reset/${token}+${user._id}`;
        this.rabbitMQService.send('notification', {
            channels: {
                email: {
                    title: 'Recuperação de senha',
                    subject: 'Recuperação de senha',
                    type: 'requestPasswordReset',
                    receivers: [username],
                    context: {
                        link,
                    },
                },
            },
        });
        return {};
    }
    async resetPassword({ userId, password, token, }) {
        const isValidToken = await this.tokenService.compare(userId, token);
        if (!isValidToken) {
            throw new Error('Token is invalid.');
        }
        await this.tokenService.deleteByUserId(userId);
        await this.userService.updatePassword(userId, password);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        token_service_1.TokenService,
        rabbit_mq_service_1.RabbitMQService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map