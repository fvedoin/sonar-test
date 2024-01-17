import { S3Client, GetObjectCommandInput, PutObjectCommandInput, DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
export declare class AwsS3ManagerRepository {
    private readonly s3;
    constructor(s3: S3Client);
    listBucketContents(params: S3.Types.ListObjectsV2Request): Promise<import("@aws-sdk/client-s3")._Object[]>;
    uploadFile(params: PutObjectCommandInput): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    deleteFile(params: DeleteObjectCommandInput): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    getSignedUrl(params: GetObjectCommandInput): Promise<string>;
}
