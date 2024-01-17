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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const token_repository_1 = require("./token.repository");
const tokens_1 = require("../utils/tokens");
const bcrypt = require("bcrypt");
let TokenService = class TokenService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async create(userId) {
        const token = await this.tokenRepository.findOneWhere({ userId });
        if (token)
            await token.deleteOne();
        const resetToken = (0, tokens_1.makeToken)(32);
        const hash = await bcrypt.hash(resetToken, 10);
        await this.tokenRepository.create({
            userId,
            token: hash,
            createdAt: new Date(),
        });
        return resetToken;
    }
    async compare(userId, token) {
        const passwordResetToken = await this.tokenRepository.findOneWhere({
            userId,
        });
        if (!passwordResetToken) {
            throw new Error('Invalid or expired password reset token.');
        }
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            throw new Error('Invalid or expired password reset token.');
        }
        return true;
    }
    async deleteByUserId(userId) {
        const passwordResetToken = await this.tokenRepository.findOneWhere({
            userId,
        });
        passwordResetToken.deleteOne();
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_repository_1.TokenRepository])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map