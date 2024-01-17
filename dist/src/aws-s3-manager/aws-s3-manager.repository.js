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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3ManagerRepository = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const aws_sdk_v3_nest_1 = require("aws-sdk-v3-nest");
let AwsS3ManagerRepository = class AwsS3ManagerRepository {
    constructor(s3) {
        this.s3 = s3;
    }
    async listBucketContents(params) {
        try {
            const listCommand = new client_s3_1.ListObjectsCommand(params);
            const response = await this.s3.send(listCommand);
            return response.Contents;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async uploadFile(params) {
        try {
            const command = new client_s3_1.PutObjectCommand(params);
            const response = await this.s3.send(command);
            return response;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async deleteFile(params) {
        try {
            const command = new client_s3_1.DeleteObjectCommand(params);
            const response = await this.s3.send(command);
            return response;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async getSignedUrl(params) {
        try {
            const command = new client_s3_1.GetObjectCommand(params);
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 120 });
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
AwsS3ManagerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, aws_sdk_v3_nest_1.InjectAws)(client_s3_1.S3Client)),
    __metadata("design:paramtypes", [client_s3_1.S3Client])
], AwsS3ManagerRepository);
exports.AwsS3ManagerRepository = AwsS3ManagerRepository;
//# sourceMappingURL=aws-s3-manager.repository.js.map