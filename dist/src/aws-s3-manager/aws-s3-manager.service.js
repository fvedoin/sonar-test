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
exports.AwsS3ManagerService = void 0;
const common_1 = require("@nestjs/common");
const aws_s3_manager_repository_1 = require("./aws-s3-manager.repository");
let AwsS3ManagerService = class AwsS3ManagerService {
    constructor(awsS3ManagerRepository) {
        this.awsS3ManagerRepository = awsS3ManagerRepository;
    }
    async fetchFromBucket(bucketName, key) {
        return this.awsS3ManagerRepository.getSignedUrl({
            Bucket: bucketName,
            Key: key,
        });
    }
    async getUrlFile(key) {
        const bucketName = process.env.AWS_BUCKET_CSV_FILES;
        return this.awsS3ManagerRepository.getSignedUrl({
            Bucket: bucketName,
            Key: key,
        });
    }
    async getListFiles(prefix) {
        const bucketName = process.env.AWS_BUCKET_CSV_FILES;
        return this.awsS3ManagerRepository.listBucketContents({
            Bucket: bucketName,
            Prefix: prefix,
        });
    }
    async uploadFile(params) {
        return this.awsS3ManagerRepository.uploadFile(params);
    }
    async deleteFile({ Bucket, Key }) {
        return this.awsS3ManagerRepository.deleteFile({
            Bucket,
            Key,
        });
    }
};
AwsS3ManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_s3_manager_repository_1.AwsS3ManagerRepository])
], AwsS3ManagerService);
exports.AwsS3ManagerService = AwsS3ManagerService;
//# sourceMappingURL=aws-s3-manager.service.js.map