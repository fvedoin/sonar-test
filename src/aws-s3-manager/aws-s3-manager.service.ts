import { Injectable } from '@nestjs/common';
import { AwsS3ManagerRepository } from './aws-s3-manager.repository';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3ManagerService {
  constructor(
    private readonly awsS3ManagerRepository: AwsS3ManagerRepository,
  ) {}

  async fetchFromBucket(bucketName: string, key: string) {
    return this.awsS3ManagerRepository.getSignedUrl({
      Bucket: bucketName,
      Key: key,
    });
  }

  async getUrlFile(key: string) {
    const bucketName = process.env.AWS_BUCKET_CSV_FILES;
    return this.awsS3ManagerRepository.getSignedUrl({
      Bucket: bucketName,
      Key: key,
    });
  }

  async getListFiles(prefix: string) {
    const bucketName = process.env.AWS_BUCKET_CSV_FILES;
    return this.awsS3ManagerRepository.listBucketContents({
      Bucket: bucketName,
      Prefix: prefix,
    });
  }

  async uploadFile(params: PutObjectCommandInput) {
    return this.awsS3ManagerRepository.uploadFile(params);
  }

  async deleteFile({ Bucket, Key }: { Bucket: string; Key: string }) {
    return this.awsS3ManagerRepository.deleteFile({
      Bucket,
      Key,
    });
  }
}
