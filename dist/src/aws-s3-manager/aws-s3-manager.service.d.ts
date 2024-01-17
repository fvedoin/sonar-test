import { AwsS3ManagerRepository } from './aws-s3-manager.repository';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';
export declare class AwsS3ManagerService {
    private readonly awsS3ManagerRepository;
    constructor(awsS3ManagerRepository: AwsS3ManagerRepository);
    fetchFromBucket(bucketName: string, key: string): Promise<string>;
    getUrlFile(key: string): Promise<string>;
    getListFiles(prefix: string): Promise<import("@aws-sdk/client-s3")._Object[]>;
    uploadFile(params: PutObjectCommandInput): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    deleteFile({ Bucket, Key }: {
        Bucket: string;
        Key: string;
    }): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
}
