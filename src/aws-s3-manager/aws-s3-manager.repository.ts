import { Injectable } from '@nestjs/common';
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InjectAws } from 'aws-sdk-v3-nest';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsS3ManagerRepository {
  constructor(@InjectAws(S3Client) private readonly s3: S3Client) {}

  async listBucketContents(params: S3.Types.ListObjectsV2Request) {
    try {
      const listCommand = new ListObjectsCommand(params);
      const response = await this.s3.send(listCommand);
      return response.Contents;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async uploadFile(params: PutObjectCommandInput) {
    try {
      const command = new PutObjectCommand(params);
      const response = await this.s3.send(command);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteFile(params: DeleteObjectCommandInput) {
    try {
      const command = new DeleteObjectCommand(params);
      const response = await this.s3.send(command);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getSignedUrl(params: GetObjectCommandInput) {
    try {
      const command = new GetObjectCommand(params);
      return await getSignedUrl(this.s3, command, { expiresIn: 120 });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
